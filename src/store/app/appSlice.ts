import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../..'


const notificationEnabledKey = 'notificationsEnabled'
export interface IAppState {
    notificationsEnabled: boolean;
    notificationPermissionGiven: boolean;
}

export const setNotificationEnabled = createAsyncThunk('app/setNotificationEnabled', async (enabled: boolean, { getState }) => {
    const state = getState() as RootState
    if (enabled && !state.app.notificationPermissionGiven) {
        const permission = await Notification.requestPermission()
        if (permission === 'denied') {
            return false
        }
    }

    if (enabled) {
        localStorage.setItem(notificationEnabledKey, String(enabled))
    }
    else {
        localStorage.removeItem(notificationEnabledKey)
    }
    return enabled
})

// maybe load this along with other app stuff
export const getNotificationEnabled = createAsyncThunk('app/getNotificationEnabled', async (_, { getState }) => {
    const state = getState() as RootState
    const enabled = Boolean(localStorage.getItem(notificationEnabledKey))
    console.warn(enabled)
    if (enabled && !state.app.notificationPermissionGiven) {
        const permission = await Notification.requestPermission()
        if (permission === 'denied') {
            localStorage.removeItem(notificationEnabledKey)
            return false
        }
    }

    return enabled
})

const appSlice = createSlice({
    name: 'app',
    initialState: {
        notificationPermissionGiven: false,
        notificationsEnabled: false,
    } as IAppState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setNotificationEnabled.fulfilled, (state, action) => {
            state.notificationsEnabled = action.payload
        });

        builder.addCase(getNotificationEnabled.fulfilled, (state, action) => {
            state.notificationsEnabled = action.payload
        });
    }
})

// export const { } = appSlice.actions

export default appSlice.reducer