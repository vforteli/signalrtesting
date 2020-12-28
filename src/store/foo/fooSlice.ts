import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Message } from '../../Components/FooTypes'

const fooSlice = createSlice({
  name: 'foos',
  initialState: [] as Message[],
  reducers: {
    sendMessage(state, action: PayloadAction<Message>) {
      state.push(action.payload)
    },
    deleteMessage(state, action: PayloadAction<string>) {
      state = state.filter(o => o.messageId !== action.payload)
    }
  }
})

export const { sendMessage, deleteMessage } = fooSlice.actions

export default fooSlice.reducer