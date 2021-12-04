import { useAuth0 } from '@auth0/auth0-react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import throttle from 'lodash.throttle';
import { createContext, FC, useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { MessageModel, OpenAPI } from '../../apiclient';
import { setCurrentUser } from '../../store/authentication/authenticationSlice';
import { fetchPreviousMessages, messageDeleted, messageReceived, messagesCleared, sendMessage, sendMessageFulfilled, setMessageAcked, setTyping } from '../../store/messages/messagesSlice';
import { setHubConnectionState } from '../../store/messages/signalrSlice';
import { getCsrfTokenFromCookie, getDefaultHeaders } from '../../Utils';

// dafuk is this?
const contextDefaultValues: IMessagesContext = {
    sendMessage: () => { },
    indicateTyping: () => { },
}

interface IMessagesContext {
    sendMessage: (chatId: string, message: string) => void
    indicateTyping: (chatId: string) => void
}

const MessagesContext = createContext<IMessagesContext>(contextDefaultValues)

export const MessagesContextProvider: FC = ({ children }) => {
    let timer: NodeJS.Timeout | null = null
    const dispatch = useDispatch()
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0()

    // todo move this to service
    const connection: HubConnection = new HubConnectionBuilder()
        .withAutomaticReconnect()
        .withUrl(process.env.REACT_APP_SIGNALR_HUB_URL ?? '', { accessTokenFactory: getAccessTokenSilently, headers: { 'X-XSRF-TOKEN': getCsrfTokenFromCookie() ?? '' } })
        .build()

    connection.on("broadcastMessage", (message: MessageModel) => {
        dispatch(messageReceived(message))
        dispatch(setTyping({ typing: false, chatId: message.chatId, userId: message.userId }))
        if (timer) {
            clearTimeout(timer)
        }

        connection.send('ackMessage', message.messageId)
    });
    connection.on("deleteMessage", (messageId: string) => dispatch(messageDeleted(messageId)));
    connection.on("clearMessages", () => dispatch(messagesCleared()));

    connection.on("indicateTyping", (chatId: string, username: string) => {
        dispatch(setTyping({ typing: true, chatId: chatId, userId: username }))
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            dispatch(setTyping({ typing: false, chatId: chatId, userId: username }))
        }, 3000)
    });

    connection.on("ackMessage", (messageId: string, userId: string) => {
        dispatch(setMessageAcked({ messageId: messageId, acked: true }))
    });

    connection.onreconnecting(() => dispatch(setHubConnectionState(connection.state)));
    connection.onreconnected(() => {
        dispatch(setHubConnectionState(connection.state));
        dispatch(fetchPreviousMessages());
    });

    useEffect(() => {
        if (isAuthenticated) {
            OpenAPI.BASE = process.env.REACT_APP_BACKEND_URL ?? ''
            OpenAPI.TOKEN = getAccessTokenSilently
            OpenAPI.HEADERS = getDefaultHeaders
            dispatch(setCurrentUser({ isLoggedIn: isAuthenticated, username: user?.name ?? '', user: user }))

            dispatch(setHubConnectionState(HubConnectionState.Connecting));
            connection.start().then(() => dispatch(setHubConnectionState(connection.state))).catch(err => console.error(err));

            return () => {
                if (connection && connection.state !== HubConnectionState.Disconnected) {
                    connection.stop();
                }
            }
        }
    }, [connection, isAuthenticated, getAccessTokenSilently, dispatch, user])


    const throttledIndicateTyping = throttle(async (chatId: string) => {
        await connection.send("indicateTyping", chatId)
    }, 1000, { leading: true, trailing: false })

    const send = async (chatId: string, message: string) => {
        dispatch(sendMessage({ chatId: chatId, message: message }))
        const response = await connection.invoke<MessageModel>('sendMessage', { chatId: chatId, message: message })
        dispatch(sendMessageFulfilled(response))
    }

    return (
        <MessagesContext.Provider value={{
            indicateTyping: throttledIndicateTyping,
            sendMessage: send,
        }}>
            {children}
        </MessagesContext.Provider>
    );
};

export const useMessages = () => useContext(MessagesContext);
