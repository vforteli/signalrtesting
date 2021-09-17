import { Action, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { HubService } from '../../apiclient';
import { Message } from '../../Components/Messages/FooTypes';
import { getCsrfTokenFromCookie } from '../../Utils';

// todo refactor this, not exactly dry
export const fetchPreviousMessages = createAsyncThunk<Message[]>(
  'foo/fetchPreviousMessages',
  async (_, { getState }) => {
    const state = getState() as RootState
    const fromDateQuery = state.messages.items.length > 0 ? `fromDate=${state.messages.items[state.messages.items.length - 1].timeSent}` : '';


    const responseFoo = await HubService.getHubService(fromDateQuery)

    const response = await fetch((process.env.REACT_APP_BACKEND_URL ?? '') + `/api/messages?${fromDateQuery}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.currentUser.accessToken}`
      }
    });

    return responseFoo.map(o => ({ message: o.message, messageId: o.messageId, name: o.name, timeSent: o.timeSent }))
    //return await response.json();
  }
)

export const sendMessage = createAsyncThunk(
  'foo/sendMessage',
  async (message: string, { getState }) => {
    const state = getState() as RootState

    const responseFoo = await HubService.postHubService({ message: message })

    const response = await fetch((process.env.REACT_APP_BACKEND_URL ?? '') + '/api/messages', {
      body: JSON.stringify({ message: message }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.currentUser.accessToken}`,
        'X-XSRF-TOKEN': getCsrfTokenFromCookie()
      }
    });
    return await response.json();
  }
)

export const deleteMessage = createAsyncThunk(
  'foo/deleteMessage',
  async (messageId: string, { getState }) => {
    const state = getState() as RootState
    const response = await fetch((process.env.REACT_APP_BACKEND_URL ?? '') + `/api/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.currentUser.accessToken}`,
        'X-XSRF-TOKEN': getCsrfTokenFromCookie()
      }
    });

    return await response.json() as Message
  }
)

export const clearMessages = createAsyncThunk(
  'foo/clearMessages',
  async (_, { getState }) => {
    const state = getState() as RootState
    const response = await fetch((process.env.REACT_APP_BACKEND_URL ?? '') + `/api/messages/clear`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.currentUser.accessToken}`
      }
    })
    return response.status
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