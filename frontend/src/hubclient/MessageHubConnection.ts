/* eslint-disable no-unused-vars */
import type { HubConnection } from '@microsoft/signalr';
import { MessageModel } from '../apiclient';
import { AckMessagesModel, IndicateTypingModel } from '../Components/Messages/Models';

export class MessageHubClient {
    private readonly _hubConnection;

    constructor(hubConnection: HubConnection) {
        this._hubConnection = hubConnection
    }

    onBroadcastMessage(callback: (message: MessageModel) => void): void {
        this._hubConnection.on('broadcastMessage', callback)
    }

    onDeleteMessage(callback: (messageId: string) => void): void {
        this._hubConnection.on('deleteMessage', callback)
    }

    onClearMessages(callback: () => void): void {
        this._hubConnection.on('clearMessages', callback)
    }

    onIndicateTyping(callback: (model: IndicateTypingModel) => void): void {
        this._hubConnection.on('indicateTyping', callback)
    }

    onAckMessages(callback: (ack: AckMessagesModel) => void): void {
        this._hubConnection.on('ackMessages', callback)
    }

    sendMessage(message: { chatId: string, message: string }): Promise<MessageModel> {
        return this._hubConnection.invoke<MessageModel>('sendMessage', message)
    }
}



// connection.on("broadcastMessage", (message: MessageModel) => {
//     dispatch(messageReceived(message))
//     dispatch(setTyping({ typing: false, chatId: message.chatId, userId: message.userId }))
//     removeTimer(message.chatId + message.userId)
//     connection.send('ackMessages', [message.messageId])
// });
// connection.on("deleteMessage", (messageId: string) => dispatch(messageDeleted(messageId)));
// connection.on("clearMessages", () => dispatch(messagesCleared()));

// connection.on("indicateTyping", (model: IndicateTypingModel) => {
//     dispatch(setTyping(model))
//     removeTimer(model.chatId + model.userId)
//     typingTimers[model.chatId + model.userId] = setTimeout(() => { dispatch(setTyping({ ...model, typing: false })) }, 3000)
// });

// connection.on("ackMessages", (ack: AckMessagesModel) => dispatch(setMessageAcked(ack)))


// t connection.send("indicateTyping", chatId) }, 1000, { leading: true, trailing: false })

// const send = async (chatId: string, message: string) => {
//     dispatch(sendMessage({ chatId: chatId, message: message }))
//     const response = await connection.invoke<MessageModel>('sendMessage', { chatId: chatId, message: message })

//     connection.send('ackMessages', messages.map(o => o.messageId))