import axios, { AxiosError } from 'axios';
import store from '../reducers/Store';
import { resetApiError, setApiError } from '../reducers/ApiErrorReducer';

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
        store.getState().apiError.isError && store.dispatch(resetApiError());
        return res;
    },
    (error: AxiosError) => {
        switch (error.response?.status) {
            case 403:
                store.dispatch(setApiError({
                    isError: true,
                    status: 403,
                    title: '회원정보가 존재하지 않습니다.'
                }))
                break;
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