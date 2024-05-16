import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthErrorStateInterface } from '../types/reducers/AuthErrorStateInterface';

/**
 * API 에러 관리 slice
 */
export const authErrorSlice = createSlice({
    name: 'AuthErrorReducer',
    initialState: {
        isError: false,
    },
    reducers: {
        setAuthError: (state: AuthErrorStateInterface, action: PayloadAction<AuthErrorStateInterface>) => {
            state.isError = action.payload.isError;
        },
    }
})

export const { setAuthError } = authErrorSlice.actions;

export default authErrorSlice.reducer;