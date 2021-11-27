import { Action, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { HubService } from '../../apiclient';
import { Message } from '../../Components/Messages/FooTypes';


export const fetchPreviousMessages = createAsyncThunk<Message[]>(
  'foo/fetchPreviousMessages',
  async (_, { getState }) => {
    const state = getState() as RootState
    const fromDateQuery = state.messages.items.length > 0 ? `fromDate=${state.messages.items[state.messages.items.length - 1].timeSent}` : '';

    return await HubService.getHub(fromDateQuery)
  }
)

export const sendMessage = createAsyncThunk(
  'foo/sendMessage',
  async (message: string, { }) => {
    const response = await HubService.postHub({ message: message })
    return response
  }
)

export const deleteMessage = createAsyncThunk(
  'foo/deleteMessage',
  async (messageId: string, { }) => {
    const response = await HubService.deleteHub(messageId)
    return response as Message
  }
)

export const clearMessages = createAsyncThunk(
  'foo/clearMessages',
  async (_, { }) => {
    const response = await HubService.deleteHub1();  // todo this is generated with the wrong name...    
    return response
  }
)

const fooSlice = createSlice({
  name: 'foos',
  initialState: {
    items: [] as Message[],
    messagesLoading: false,
    clearMessagesLoading: false,
    selectedMessages: [] as string[]
  },
  reducers: {
    messageReceived(state, action: PayloadAction<Message>) {
      state.items.push(action.payload);
    },
    messageDeleted(state, action: PayloadAction<string>) {
      state.items = state.items.filter(o => o.messageId !== action.payload);
    },
    messagesCleared(state, action: Action) {
      state.items = [];
    },
    getMessages(state, action: PayloadAction<Message[]>) {
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