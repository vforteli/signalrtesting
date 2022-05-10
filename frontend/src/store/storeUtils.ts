import { AsyncThunk, AsyncThunkOptions, AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from './store';

type TypedCreateAsyncThunk<ThunkApiConfig> = <Returned, ThunkArg = void>(
    typePrefix: string,
    payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>,
    options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>
) => AsyncThunk<Returned, ThunkArg, ThunkApiConfig>;

export const createAppAsyncThunk: TypedCreateAsyncThunk<{
    state: RootState;
}> = createAsyncThunk;