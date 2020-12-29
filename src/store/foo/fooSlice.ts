import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Message } from '../../Components/FooTypes'


export const fetchPreviousMessages = createAsyncThunk('foo/fetchPreviousMessages',
  async () => {
    const response = await fetch('https://localhost:5001/api/messages');
    return await response.json();
  }
)

export const sendMessage = createAsyncThunk('foo/sendMessage',
  async (message: string) => {
    // const response = await fetch('https://localhost:5001/api/messages');
    // return await response.json();
  }
)

export const deleteMessage = createAsyncThunk('foo/deleteMessage',
  async (messageId: string) => {
    const response = await fetch(`https://localhost:5001/api/messages/${messageId}`, { method: 'DELETE' });
    return response.status
  }
)

const fooSlice = createSlice({
  name: 'foos',
  initialState: [] as Message[],
  reducers: {
    messageReceived(state, action: PayloadAction<Message>) {
      state.push(action.payload)
    },
    messageDeleted(state, action: PayloadAction<string>) {
      return state.filter(o => o.messageId !== action.payload)
    },
    clearMessages(state, action: PayloadAction) {
      return []
    },
    getMessages(state, action: PayloadAction<Message[]>) {
      state = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPreviousMessages.pending, (state) => {
      console.debug('fetchPreviousMessages pending');
    });
    builder.addCase(fetchPreviousMessages.fulfilled, (state, action) => {
      console.debug('fetchPreviousMessages fulfilled');
      return action.payload;
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
  }
})

export const {
  messageReceived,
  clearMessages,
  messageDeleted,
  getMessages } = fooSlice.actions

export default fooSlice.reducer