import { HubConnectionState } from '@microsoft/signalr';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const signalrSlice = createSlice({
    name: 'signalr',
    initialState: { connectionState: HubConnectionState.Disconnected },
    reducers: {
        setHubConnectionState(state, action: PayloadAction<HubConnectionState>) {
            state.connectionState = action.payload;
        }
    }
})

export const { setHubConnectionState } = signalrSlice.actions

export default signalrSlice.reducer