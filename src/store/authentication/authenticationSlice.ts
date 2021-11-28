import { User } from '@auth0/auth0-react';
import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface IAuthenticationState {
    username: string;
    isLoggedIn: boolean;
    user: User | undefined;
}


const authenticationSlice = createSlice({
    name: 'signalr',
    initialState: {
        isLoggedIn: false,
        username: '',
        user: undefined,
    } as IAuthenticationState,
    reducers: {
        setCurrentUser(state, action: PayloadAction<IAuthenticationState>) {
            return action.payload;
        },
        clearCurrentUser(state, action: Action) {
            return { username: '', isLoggedIn: false, accessToken: '', user: undefined };
        }
    }
})

export const {
    setCurrentUser,
    clearCurrentUser
} = authenticationSlice.actions

export default authenticationSlice.reducer