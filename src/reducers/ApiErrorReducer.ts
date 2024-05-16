import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ApiErrorStateInterface } from '../types/reducers/ApiErrorStateInterface';

/**
 * API 에러 관리 slice
 */
export const apiErrorSlice = createSlice({
    name: 'ApiErrorReducer',
    initialState: {
        isError: false,
        status: undefined,
        title: undefined,
        subtitle: undefined
    },
    reducers: {
        setApiError: (state: ApiErrorStateInterface, action: PayloadAction<ApiErrorStateInterface>) => {
            state.isError = action.payload.isError;
            state.status = action.payload.status;
            state.title = action.payload.title;
            state.subtitle = action.payload.subtitle;
        },
        resetApiError: (state: ApiErrorStateInterface) => {
            state.isError = false;
            state.status = undefined;
            state.title = undefined;
            state.subtitle = undefined;
        }
    }
})

export const { setApiError, resetApiError } = apiErrorSlice.actions;

export default apiErrorSlice.reducer;