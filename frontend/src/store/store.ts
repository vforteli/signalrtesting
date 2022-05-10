import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import logger from 'redux-logger'
import appSlice from './app/appSlice';
import authenticationSlice from './authentication/authenticationSlice';
import messagesSlice from './messages/messagesSlice';
import signalrSlice from './messages/signalrSlice';

export const store = configureStore({
    reducer: {
        messages: messagesSlice,
        signalr: signalrSlice,
        currentUser: authenticationSlice,
        app: appSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
})

export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

