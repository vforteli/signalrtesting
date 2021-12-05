import { useAuth0 } from '@auth0/auth0-react';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import throttle from 'lodash.throttle';
import { createContext, FC, useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { MessageModel } from '../../apiclient';
import { fetchPreviousMessages, messageDeleted, messageReceived, messagesCleared, sendMessage, sendMessageFulfilled, setMessageAcked, setTyping } from '../../store/messages/messagesSlice';
import { setHubConnectionState } from '../../store/messages/signalrSlice';
import { getCsrfTokenFromCookie } from '../../Utils';

interface IMessagesContext {
    sendMessage: (chatId: string, message: string) => void
    indicateTyping: (chatId: string) => void
}

const MessagesContext = createContext<IMessagesContext | undefined>(undefined)

export const MessagesContextProvider: FC = ({ children }) => {

    const typingTimers: Record<string, NodeJS.Timeout> = {}

    const removeTimer = (id: string) => {
        const timer = typingTimers[id]
        if (timer) {
            clearTimeout(timer)
            delete typingTimers[id]
        }
    }

    const dispatch = useDispatch()
    const { isAuthenticated, getAccessTokenSilently } = useAuth0()

    const connection = new HubConnectionBuilder()
        .withAutomaticReconnect()
        .withUrl(process.env.REACT_APP_SIGNALR_HUB_URL ?? '', { accessTokenFactory: getAccessTokenSilently, headers: { 'X-XSRF-TOKEN': getCsrfTokenFromCookie() ?? '' } })
        .build()

    connection.on("broadcastMessage", (message: MessageModel) => {
        dispatch(messageReceived(message))
        dispatch(setTyping({ typing: false, chatId: message.chatId, userId: message.userId }))
        removeTimer(message.chatId + message.userId)
        connection.send('ackMessage', message.messageId)
    });
    connection.on("deleteMessage", (messageId: string) => dispatch(messageDeleted(messageId)));
    connection.on("clearMessages", () => dispatch(messagesCleared()));

    connection.on("indicateTyping", (chatId: string, userId: string) => {
        dispatch(setTyping({ typing: true, chatId: chatId, userId: userId }))
        removeTimer(chatId + userId)
        typingTimers[chatId + userId] = setTimeout(() => { dispatch(setTyping({ typing: false, chatId: chatId, userId: userId })) }, 3000)
    });

    connection.on("ackMessage", (messageId: string, userId: string) => dispatch(setMessageAcked({ messageId: messageId, userId: userId, acked: true })))

    connection.onreconnecting(() => dispatch(setHubConnectionState(connection.state)));
    connection.onreconnected(() => {
        dispatch(setHubConnectionState(connection.state));
        dispatch(fetchPreviousMessages());
    });

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(setHubConnectionState(HubConnectionState.Connecting));
            connection.start().then(() => dispatch(setHubConnectionState(connection.state))).catch(err => console.error(err));
        }

        return () => {
            if (connection && connection.state !== HubConnectionState.Disconnected) {
                connection.stop();
            }
        }
    }, [connection, isAuthenticated, dispatch])


    const throttledIndicateTyping = throttle(async (chatId: string) => { await connection.send("indicateTyping", chatId) }, 1000, { leading: true, trailing: false })

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

export const useMessages = () => {
    const context = useContext(MessagesContext)
    if (context) {
        return context
    }

    throw Error('Context undefined? Forgot a provider somewhere?')
}
