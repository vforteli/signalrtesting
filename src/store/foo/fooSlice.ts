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

const fooSlice = createSlice({
  name: 'foos',
  initialState: [] as Message[],
  reducers: {
    messageReceived(state, action: PayloadAction<Message>) {
      state.push(action.payload)
    },
    deleteMessage(state, action: PayloadAction<string>) {
      return state.filter(o => o.messageId !== action.payload)
    },
    clearMessages(state, action: PayloadAction) {
      return []
    },
    getMessages(state, action: PayloadAction<Message[]>) {
      state = action.payload
    }
  },
  extraReducers: {
    [fetchPreviousMessages.pending.toString()]: (state, action) => {
      console.debug('fetching previous messages pending');
    },
    [fetchPreviousMessages.fulfilled.toString()]: (state, action) => {
      console.debug('fetching previous messages fulfilled');
      return action.payload;
    }
  }
})

export const { messageReceived, clearMessages, deleteMessage, getMessages } = fooSlice.actions

export default fooSlice.reducer