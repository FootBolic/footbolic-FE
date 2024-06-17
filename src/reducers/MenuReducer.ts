import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MenuStateInterface } from '../types/reducers/MenuStateInterface';

/**
 * 메뉴 관리 slice
 */
export const menuSlice = createSlice({
    name: 'menuReducer',
    initialState: {
        isMobileMenuOpen: false,
    },
    reducers: {
        setIsMobileMenuOpen: (state: MenuStateInterface, action: PayloadAction<MenuStateInterface>) => {
            state.isMobileMenuOpen = action.payload.isMobileMenuOpen;
        }
    }
})

export const { setIsMobileMenuOpen } = menuSlice.actions;

export default menuSlice.reducer;