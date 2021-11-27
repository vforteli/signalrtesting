import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface IAuthenticationState {
    username: string;
    isLoggedIn: boolean;
}


const authenticationSlice = createSlice({
    name: 'signalr',
    initialState: {
        isLoggedIn: false,
        username: ''
    } as IAuthenticationState,
    reducers: {
        setCurrentUser(state, action: PayloadAction<IAuthenticationState>) {
            return action.payload;
        },
        clearCurrentUser(state, action: Action) {
            return { username: '', isLoggedIn: false, accessToken: '' };
        }
    }
})

export const {
    setCurrentUser,
    clearCurrentUser
} = authenticationSlice.actions

export default authenticationSlice.reducer