import { HubConnectionState } from '@microsoft/signalr';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

const signalrSlice = createSlice({
    name: 'signalr',
    initialState: { connectionState: HubConnectionState.Disconnected },
    reducers: {
        setHubConnectionState(state, action: PayloadAction<HubConnectionState>) {
            state.connectionState = action.payload;
        }
    },
    extraReducers: (builder) => {
        // builder.addCase(connect.pending, (state) => {
        //     console.debug('fetching previous messages pending');
        // });

    }
})

export const { setHubConnectionState } = signalrSlice.actions

export default signalrSlice.reducer