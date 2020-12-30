import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface IAuthenticationState {
    username: string;
    accessToken: string;
    isLoggedIn: boolean;
}


const authenticationSlice = createSlice({
    name: 'signalr',
    initialState: {
        accessToken: '',
        isLoggedIn: false,
        username: ''
    } as IAuthenticationState,
    reducers: {
        setCurrentUser(state, action: PayloadAction<IAuthenticationState>) {
            return action.payload;
        },
        clearCurrentUser(state, action: PayloadAction) {
            return { username: '', isLoggedIn: false, accessToken: '' };
        }
    }
})

export const { setCurrentUser } = authenticationSlice.actions

export default authenticationSlice.reducer