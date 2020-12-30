import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../..';
import { Message } from '../../Components/FooTypes'

// todo refactor this, not exactly dry
export const fetchPreviousMessages = createAsyncThunk<Message[]>('foo/fetchPreviousMessages',
  async (_, { getState }) => {
    const state = getState() as RootState
    const response = await fetch('https://localhost:5001/api/messages', {
      headers: {
        'Authorization': `Bearer ${state.currentUser.accessToken}`
      }
    });

    return await response.json();
  }
)

export const sendMessage = createAsyncThunk('foo/sendMessage',
  async (message: string, { getState }) => {
    const state = getState() as RootState
    const response = await fetch('https://localhost:5001/api/messages', {
      body: JSON.stringify({ message: message }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.currentUser.accessToken}`
      }
    });
    return await response.json();
  }
)

export const deleteMessage = createAsyncThunk('foo/deleteMessage',
  async (messageId: string, { getState }) => {
    const state = getState() as RootState
    const response = await fetch(`https://localhost:5001/api/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${state.currentUser.accessToken}`
      }
    });
    return response.status
  }
)

export const clearMessages = createAsyncThunk('foo/clearMessages',
  async (_, { getState }) => {
    const state = getState() as RootState
    const response = await fetch(`https://localhost:5001/api/messages/clear`, {
      method: 'DELETE',
      headers: {
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
    clearMessagesLoading: false,
  },
  reducers: {
    messageReceived(state, action: PayloadAction<Message>) {
      state.items.push(action.payload);
    },
    messageDeleted(state, action: PayloadAction<string>) {
      state.items = state.items.filter(o => o.messageId !== action.payload);
    },
    messagesCleared(state, action: PayloadAction) {
      state.items = [];
    },
    getMessages(state, action: PayloadAction<Message[]>) {
      state.items = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPreviousMessages.pending, (state) => {
      console.debug('fetchPreviousMessages pending');
    });
    builder.addCase(fetchPreviousMessages.fulfilled, (state, action) => {
      console.debug('fetchPreviousMessages fulfilled');
      state.items = action.payload;
    });
    builder.addCase(fetchPreviousMessages.rejected, (state, action) => {
      console.debug('fetchPreviousMessages reject');
      console.debug(action.error)
    });

    builder.addCase(deleteMessage.pending, (state) => {
      // todo this could actually optimistically remove the message, but now it will just wait for signalr to send the messageDeleted event
    });
    builder.addCase(deleteMessage.fulfilled, (state, action) => {
      // todo this could actually optimistically remove the message, but now it will just wait for signalr to send the messageDeleted event
    });
    builder.addCase(deleteMessage.rejected, (state, action) => {
      console.debug('deleteMessage rejected');
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
      console.debug('clearmessages rejected');
      console.debug(action.error)
    })
  }
})

export const {
  messageReceived,
  messagesCleared,
  messageDeleted,
  getMessages } = fooSlice.actions

export default fooSlice.reducer