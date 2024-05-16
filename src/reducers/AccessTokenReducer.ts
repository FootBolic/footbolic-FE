import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AccessTokenStateInterface } from '../types/reducers/AccessTokenStateInterface';

/**
 * Access Token을 관리하는 slice
 */
export const accessTokenSlice = createSlice({
    name: 'accessTokenReducer',
    initialState: {
        accessToken: undefined,
        accessTokenExpiresAt: undefined,
        nickname: undefined,
        isFetchingRenewal: false
    },
    reducers: {
        setAccessTokenState: (state: AccessTokenStateInterface, action: PayloadAction<AccessTokenStateInterface>) => {
            state.accessToken = action.payload.accessToken;
            state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt;
            state.nickname = action.payload.nickname;
        },
        resetAccessTokenState: (state: AccessTokenStateInterface) => {
            state.accessToken = undefined;
            state.accessTokenExpiresAt = undefined;
            state.nickname = undefined;
        },

    }
})

export const { setAccessTokenState, resetAccessTokenState } = accessTokenSlice.actions;

export default accessTokenSlice.reducer;