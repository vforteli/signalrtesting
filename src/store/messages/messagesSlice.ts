import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { MessageModel, MessageService } from '../../apiclient';


export const fetchPreviousMessages = createAsyncThunk<MessageModel[]>('messages/fetchPreviousMessages', async (_, { getState }) => {
  const state = getState() as RootState
  const fromDateQuery = state.messages.items.length > 0 ? state.messages.items[state.messages.items.length - 1]!.timeSent : '';
  return await MessageService.getMessages(fromDateQuery)
})

export const deleteMessage = createAsyncThunk('messages/deleteMessage', async (messageId: string) => {
  return await MessageService.deleteMessage(messageId)
})

export const clearMessages = createAsyncThunk('messages/clearMessages', async () => {
  return await MessageService.clearMessage()
})

export const messageReceived = createAsyncThunk('messages/messageReceived', async (message: MessageModel, { getState }) => {
  const state = getState() as RootState
  if (state.app.notificationsEnabled) {
    new Notification(message.message);
  }
  return message
})

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [] as MessageModel[],
    messagesLoading: false,
    clearMessagesLoading: false,
    selectedMessages: [] as string[],
    typing: {} as Record<string, string[]>,
  },
  reducers: {
    messageDeleted(state, action: PayloadAction<string>) {
      state.items = state.items.filter(o => o.messageId !== action.payload);
    },
    messagesCleared(state) {
      state.items = [];
    },
    getMessages(state, action: PayloadAction<MessageModel[]>) {
      state.items = action.payload
    },
    setMessageActive(state, action: PayloadAction<({ messageId: string, active: boolean })>) {
      if (action.payload.active && !state.selectedMessages.includes(action.payload.messageId)) {
        state.selectedMessages.push(action.payload.messageId)
      }
      else if (!action.payload.active && state.selectedMessages.includes(action.payload.messageId)) {
        state.selectedMessages = state.selectedMessages.filter(o => o !== action.payload.messageId);
      }
    },
    setTyping(state, action: PayloadAction<({ chatId: string, userId: string, typing: boolean })>) {
      if (action.payload.typing) {
        state.typing[action.payload.chatId] = [action.payload.userId, ...state.typing[action.payload.chatId] ?? []] // duh, duplicates
      }
      else if (state.typing[action.payload.chatId]) {
        state.typing[action.payload.chatId] = state.typing[action.payload.chatId]!.filter(o => o !== action.payload.userId)
      }
    },
    sendMessage(state, action: PayloadAction<({ chatId: string, message: string })>) {
      state.items.push({
        message: action.payload.message,
        chatId: action.payload.chatId,
        messageId: 'pending',
        userId: '',
        timeSent: '',
      });
    },
    sendMessageFulfilled(state, action: PayloadAction<MessageModel>) {
      const index = state.items.findIndex(o => o.messageId === 'pending')
      state.items[index] = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(messageReceived.fulfilled, (state, action) => {
      if (state.typing[action.payload.chatId]) {
        state.typing[action.payload.chatId] = state.typing[action.payload.chatId]!.filter(o => o !== action.payload.userId)
      }

      state.items.push(action.payload);
    });

    builder.addCase(fetchPreviousMessages.pending, (state) => {
      state.messagesLoading = true;
    });
    builder.addCase(fetchPreviousMessages.fulfilled, (state, action) => {
      state.messagesLoading = false;
      state.items = state.items.concat(action.payload);
    });
    builder.addCase(fetchPreviousMessages.rejected, (state, action) => {
      state.messagesLoading = false;
      console.debug(action.error)
    });


    builder.addCase(deleteMessage.pending, (state) => {
      // loading?
    });
    builder.addCase(deleteMessage.fulfilled, (state, action) => {
      state.items = state.items.filter(o => o.messageId !== action.payload.messageId);
    });
    builder.addCase(deleteMessage.rejected, (state, action) => {
      console.debug(action.error)
    });


    builder.addCase(clearMessages.pending, state => {
      state.clearMessagesLoading = true;
    });
    builder.addCase(clearMessages.fulfilled, state => {
      state.clearMessagesLoading = false;
    })
    builder.addCase(clearMessages.rejected, (state, action) => {
      state.clearMessagesLoading = false;
      console.debug(action.error)
    })
  }
})

export const {
  messagesCleared,
  messageDeleted,
  getMessages,
  setMessageActive,
  setTyping,
  sendMessage,
  sendMessageFulfilled,
} = messagesSlice.actions

export default messagesSlice.reducer