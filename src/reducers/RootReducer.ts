import { combineReducers } from '@reduxjs/toolkit';
import PlatformReducer from './PlatformReducer';
import MobileMenuReducer from './MobileMenuReducer';

/**
 * redux reducers 관리 store
 */
export default combineReducers({
    platform: PlatformReducer,
    mobileMenu: MobileMenuReducer
});