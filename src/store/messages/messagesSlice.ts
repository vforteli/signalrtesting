import { Action, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { MessageModel, MessageService } from '../../apiclient';


export const fetchPreviousMessages = createAsyncThunk<MessageModel[]>(
  'foo/fetchPreviousMessages',
  async (_, { getState }) => {
    const state = getState() as RootState
    const fromDateQuery = state.messages.items.length > 0 ? state.messages.items[state.messages.items.length - 1].timeSent : '';
    return await MessageService.getMessages(fromDateQuery)
  }
)

export const sendMessage = createAsyncThunk(
  'foo/sendMessage',
  async (message: string, { }) => {
    const response = await MessageService.sendMessage({ message: message })
    return response
  }
)

export const deleteMessage = createAsyncThunk(
  'foo/deleteMessage',
  async (messageId: string, { }) => {
    return await MessageService.deleteMessage(messageId)
  }
)

export const clearMessages = createAsyncThunk(
  'foo/clearMessages',
  async (_, { }) => {
    const response = await MessageService.clearMessage();
    return response
  }
)

const fooSlice = createSlice({
  name: 'foos',
  initialState: {
    items: [] as MessageModel[],
    messagesLoading: false,
    clearMessagesLoading: false,
    selectedMessages: [] as string[]
  },
  reducers: {
    messageReceived(state, action: PayloadAction<MessageModel>) {
      state.items.push(action.payload);
    },
    messageDeleted(state, action: PayloadAction<string>) {
      state.items = state.items.filter(o => o.messageId !== action.payload);
    },
    messagesCleared(state, action: Action) {
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
    }
  },
  extraReducers: (builder) => {
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
  messageReceived,
  messagesCleared,
  messageDeleted,
  getMessages,
  setMessageActive
} = fooSlice.actions

export default fooSlice.reducer