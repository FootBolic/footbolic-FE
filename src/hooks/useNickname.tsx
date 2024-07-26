import { useMutation } from 'react-query';
import { MemberAPI } from '../api/member/MemberAPI';

export const useCheckDuplicate = () => {
  return useMutation(async (nickname: string) => {
    const response = await MemberAPI.existsByNickname(nickname);
    return response.memberExists;
  });
};