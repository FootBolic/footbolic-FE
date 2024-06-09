import { combineReducers } from '@reduxjs/toolkit';
import PlatformReducer from './PlatformReducer';
import MenuReducer from './MenuReducer';
import CsrfTokenReducer from './CsrfTokenReducer';
import AccessTokenReducer from './AccessTokenReducer';
import AuthErrorReducer from './AuthErrorReducer';

/**
 * redux reducers 관리 store
 */
export default combineReducers({
    platform: PlatformReducer,
    menu: MenuReducer,
    csrfToken: CsrfTokenReducer,
    accessToken: AccessTokenReducer,
    authError: AuthErrorReducer,
});