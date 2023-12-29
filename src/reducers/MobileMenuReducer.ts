import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MobileMenuStateInterface } from '../types/reducers/MobileMenuStateInterface';

/**
 * 모바일 메뉴 관리 slice
 */
export const mobileMenuSlice = createSlice({
    name: 'mobileMenuReducer',
    initialState: {
        isMobileMenuOpen: false,
    },
    reducers: {
        setIsMobileMenuOpen: (state: MobileMenuStateInterface, action: PayloadAction<MobileMenuStateInterface>) => {
            state.isMobileMenuOpen = action.payload.isMobileMenuOpen;
        }
    }
})

export const { setIsMobileMenuOpen } = mobileMenuSlice.actions;

export default mobileMenuSlice.reducer;