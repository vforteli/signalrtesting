import { useAuth0 } from '@auth0/auth0-react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import throttle from 'lodash.throttle';
import { createContext, FC, useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { MessageModel, OpenAPI } from '../../apiclient';
import { setCurrentUser } from '../../store/authentication/authenticationSlice';
import { fetchPreviousMessages, messageDeleted, messageReceived, messagesCleared, sendMessage, setTyping } from '../../store/messages/messagesSlice';
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
        .withUrl(process.env.REACT_APP_SIGNALR_HUB_URL ?? '', { accessTokenFactory: getAccessTokenSilently, headers: { 'X-XSRF-TOKEN': getCsrfTokenFromCookie() } })
        .build()

    connection.on("broadcastMessage", (message: MessageModel) => {
        dispatch(messageReceived(message))
        dispatch(setTyping({ typing: false, chatId: '42', userId: 'someuser' }))
        if (timer) {
            clearTimeout(timer)
        }
    });
    connection.on("deleteMessage", (messageId: string) => dispatch(messageDeleted(messageId)));
    connection.on("clearMessages", () => dispatch(messagesCleared()));

    connection.on("indicateTyping", (chatId: string, username: string) => {
        dispatch(setTyping({ typing: true, chatId: '42', userId: username }))
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            dispatch(setTyping({ typing: false, chatId: '42', userId: username }))
        }, 3000)
    });

    connection.onreconnecting(() => dispatch(setHubConnectionState(connection.state)));
    connection.onreconnected(() => {
        dispatch(setHubConnectionState(connection.state));
        dispatch(fetchPreviousMessages());
    });

    useEffect(() => {
        if (isAuthenticated) {
            (async () => {
                OpenAPI.BASE = process.env.REACT_APP_BACKEND_URL ?? ''
                OpenAPI.TOKEN = getAccessTokenSilently
                OpenAPI.HEADERS = getDefaultHeaders
                dispatch(setCurrentUser({ isLoggedIn: isAuthenticated, username: user?.name ?? '', user: user }))
            })();

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
        await connection.invoke("indicateTyping", chatId)
    }, 1000, { leading: true, trailing: false })

    const send = (chatId: string, message: string) => {
        dispatch(sendMessage(message))
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
