import axios, { AxiosError } from 'axios';
import store from '../reducers/Store';
import { setAuthError } from '../reducers/AuthErrorReducer';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL_DEV,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json; charset=UTF-8;',
        accept: 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().accessToken.accessToken;
        if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;
        return config;
    }
)

api.interceptors.response.use(
    (res) => {
        store.getState().authError.isError && store.dispatch(setAuthError({ isError: false }));
        if (!res.data.isSuccess) return Promise.reject(res.data.message);
        return res;
    },
    (error: AxiosError) => {
        switch (error.response?.status) {
            case 403:
                store.dispatch(setAuthError({ isError: true }))
                break;
            case 400:
                return Promise.reject((error.response.data as any).message);
        }
    }
)

export default api;

export const kakaoAuthApi = axios.create({
    baseURL: 'https://kauth.kakao.com',
    headers: {
        'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8'
    }
})

export const kakaoApi = axios.create({
    baseURL: 'https://kapi.kakao.com',
    headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
})

export const naverAuthApi = axios.create({
    baseURL: 'https://nid.naver.com'
})

export const naverApi = axios.create({
    baseURL: 'https://openapi.naver.com'
})