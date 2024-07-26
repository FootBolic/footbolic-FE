import { useMutation } from 'react-query';
import axios from 'axios';

export const useCheckDuplicate = () => {
  return useMutation(async (nickname: string) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_DEV}/members/public/check?nickname=${nickname}`, {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8;',
            accept: 'application/json'
        }
    });
    return response.data.memberExists;
  });
};

export const useRegulate = () => {
  
}