import { useAuth0 } from '@auth0/auth0-react';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import throttle from 'lodash.throttle';
import { createContext, FC, useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { MessageModel, MessageService } from '../../apiclient';
import { MessageHubClient } from '../../hubclient/MessageHubConnection';
import { AppConfig } from '../../appConfig';
import { fetchMessagesFulfilled, fetchMessagesPending, messageDeleted, messageReceived, messagesCleared, sendMessage, sendMessageFulfilled, setMessageAcked, setTyping } from '../../store/messages/messagesSlice';
import { setHubConnectionState } from '../../store/messages/signalrSlice';
import { getCsrfTokenFromCookie } from '../../Utils';

interface IMessagesContext {
    sendMessage: (chatId: string, message: string) => void
    fetchMessages: () => void
    indicateTyping: (chatId: string) => void
    hubConnectionState: HubConnectionState
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
        .withUrl(AppConfig.REACT_APP_SIGNALR_HUB_URL, { accessTokenFactory: getAccessTokenSilently, headers: { 'X-XSRF-TOKEN': getCsrfTokenFromCookie() ?? '' } })
        .build()

    const messageHubClient = new MessageHubClient(connection)

    messageHubClient.onBroadcastMessage((message) => {
        dispatch(messageReceived(message))
        dispatch(setTyping({ typing: false, chatId: message.chatId, userId: message.userId }))
        removeTimer(message.chatId + message.userId)
        connection.send('ackMessages', [message.messageId])
    })

    // connection.on("broadcastMessage", (message: MessageModel) => {
    //     dispatch(messageReceived(message))
    //     dispatch(setTyping({ typing: false, chatId: message.chatId, userId: message.userId }))
    //     removeTimer(message.chatId + message.userId)
    //     connection.send('ackMessages', [message.messageId])
    // });

    messageHubClient.onDeleteMessage(messageId => dispatch(messageDeleted(messageId)));
    // connection.on("deleteMessage", (messageId: string) => dispatch(messageDeleted(messageId)));

    messageHubClient.onClearMessages(() => dispatch(messagesCleared()));
    // connection.on("clearMessages", () => dispatch(messagesCleared()));

    messageHubClient.onIndicateTyping(model => {
        dispatch(setTyping(model))
        removeTimer(model.chatId + model.userId)
        typingTimers[model.chatId + model.userId] = setTimeout(() => { dispatch(setTyping({ ...model, typing: false })) }, 3000)
    })
    // connection.on("indicateTyping", (model: IndicateTypingModel) => {
    //     dispatch(setTyping(model))
    //     removeTimer(model.chatId + model.userId)
    //     typingTimers[model.chatId + model.userId] = setTimeout(() => { dispatch(setTyping({ ...model, typing: false })) }, 3000)
    // });

    messageHubClient.onAckMessages(ack => dispatch(setMessageAcked(ack)))
    // connection.on("ackMessages", (ack: AckMessagesModel) => dispatch(setMessageAcked(ack)))

    connection.onreconnecting(() => dispatch(setHubConnectionState(connection.state)));
    connection.onreconnected(() => {
        dispatch(setHubConnectionState(connection.state));
        fetchMessages()
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

    const fetchMessages = async () => {
        dispatch(fetchMessagesPending())
        // const state = getState() as RootState
        // const fromDateQuery = state.messages.items.length > 0 ? state.messages.items[state.messages.items.length - 1]!.timeSent : '';
        const messages = await MessageService.getMessages()
        dispatch(fetchMessagesFulfilled(messages))
        connection.send('ackMessages', messages.map(o => o.messageId))
    }


    return (
        <MessagesContext.Provider value={{
            indicateTyping: throttledIndicateTyping,
            sendMessage: send,
            fetchMessages: fetchMessages,
            hubConnectionState: connection.state,
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
