import { User } from '@auth0/auth0-react';
import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialAuthenticationState: IAuthenticationState = {
    isLoggedIn: false,
    username: '',
    user: undefined,
}

export interface IAuthenticationState {
    username: string;
    isLoggedIn: boolean;
    user: User | undefined;
}


const authenticationSlice = createSlice({
    name: 'signalr',
    initialState: initialAuthenticationState,
    reducers: {
        setCurrentUser(state, action: PayloadAction<IAuthenticationState>) {
            return action.payload
        },
        clearCurrentUser(state, action: Action) {
            return initialAuthenticationState
        }
    }
})

export const {
    setCurrentUser,
    clearCurrentUser
} = authenticationSlice.actions

export default authenticationSlice.reducer