import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL_DEV,
    headers: {
        'Content-Type': 'application/json; charset=UTF-8;',
        accept: 'application/json'
    }
})

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