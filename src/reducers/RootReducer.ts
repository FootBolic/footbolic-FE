import { combineReducers } from '@reduxjs/toolkit';
import PlatformReducer from './PlatformReducer';
import MobileMenuReducer from './MobileMenuReducer';
import CsrfTokenReducer from './CsrfTokenReducer';
import AccessTokenReducer from './AccessTokenReducer';
import ApiErrorReducer from './ApiErrorReducer';

/**
 * redux reducers 관리 store
 */
export default combineReducers({
    platform: PlatformReducer,
    mobileMenu: MobileMenuReducer,
    csrfToken: CsrfTokenReducer,
    accessToken: AccessTokenReducer,
    apiError: ApiErrorReducer,
});