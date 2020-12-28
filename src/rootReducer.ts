import { combineReducers } from '@reduxjs/toolkit'
import fooSlice from './store/foo/fooSlice'

const rootReducer = combineReducers({ fooReducer: fooSlice })

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer