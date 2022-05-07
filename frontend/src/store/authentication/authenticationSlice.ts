import { User } from '@auth0/auth0-react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialAuthenticationState: IAuthenticationState = {
    isLoggedIn: false,
    user: undefined,
}

export interface IAuthenticationState {
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
        clearCurrentUser() {
            return initialAuthenticationState
        }
    }
})

export const {
    setCurrentUser,
    clearCurrentUser
} = authenticationSlice.actions

export default authenticationSlice.reducer