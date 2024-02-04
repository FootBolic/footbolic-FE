import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL_DEV,
    headers: {
        'Content-Type': 'application/json; charset=UTF-8;',
        accept: 'application/json'
    }
})