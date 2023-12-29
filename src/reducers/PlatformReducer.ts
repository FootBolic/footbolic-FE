import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PlatformStateInterface } from '../types/reducers/PlatformStateInterface';

/**
 * 접속 플랫폼 관리 slice
 */
export const platformSlice = createSlice({
    name: 'PlatformReducer',
    initialState: {
        isMobile: false,
    },
    reducers: {
        setIsMobile: (state: PlatformStateInterface, action: PayloadAction<PlatformStateInterface>) => {
            state.isMobile = action.payload.isMobile;
        }
    }
})

export const { setIsMobile } = platformSlice.actions;

export default platformSlice.reducer;