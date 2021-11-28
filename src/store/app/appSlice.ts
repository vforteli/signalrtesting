import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../..'


export interface IAppState {
    notificationsEnabled: boolean;
    notificationPermissionGiven: boolean;
}

export const setNotificationEnabled = createAsyncThunk(
    'app/setNotificationEnabled',
    async (enabled: boolean, { getState }) => {
        const state = getState() as RootState
        if (enabled && !state.app.notificationPermissionGiven) {
            const permission = await Notification.requestPermission()
            if (permission === 'denied') {
                return false
            }
        }

        return enabled
    }
)

const appSlice = createSlice({
    name: 'app',
    initialState: {
        notificationPermissionGiven: false,
        notificationsEnabled: false,    // perhaps save in localstorage 
    } as IAppState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setNotificationEnabled.fulfilled, (state, action) => {
            state.notificationsEnabled = action.payload
        });
    }
})

export const {
} = appSlice.actions

export default appSlice.reducer