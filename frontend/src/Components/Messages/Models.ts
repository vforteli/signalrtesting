

export type IndicateTypingModel = {
    chatId: string,
    userId: string,
    typing: boolean,
}

export type AckMessagesModel = {
    userId: string,
    messageIds: Array<string>,
}