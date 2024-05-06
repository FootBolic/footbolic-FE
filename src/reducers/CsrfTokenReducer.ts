import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CsrfTokenStateInterface } from '../types/reducers/CsrfTokenStateInterface';

/**
 * 모바일 메뉴 관리 slice
 */
export const csrfTokenSlice = createSlice({
    name: 'csrfTokenReducer',
    initialState: {
        token: '',
    },
    reducers: {
        setCsrfTokenState: (state: CsrfTokenStateInterface, action: PayloadAction<CsrfTokenStateInterface>) => {
            state.token = action.payload.token;
        }
    }
})

export const { setCsrfTokenState } = csrfTokenSlice.actions;

export default csrfTokenSlice.reducer;