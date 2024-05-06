import { NaverTokenInterface } from "../../types/common/NaverApiInterface";
import { MemberInterface } from "../../types/entity/member/MemberInterface";
import { api } from "../api";

/**
 * 회원 API 관리 클래스
 */
export class MemberAPI {
    /**
     * 회원 목록 조회 API
     * @returns {Promise<MemberInterface[]>} 회원 목록 Promise 객체
     */
    static async getMembers(): Promise<MemberInterface[]> {
        const members = await api.get('/members');

        return members.data.isSuccess ? members.data.data : [];
    }

    /**
     * 인증기관과 인증기관에서 제공 받은 회원 식별번호로 회원가입 여부 조회
     * @param {string} idAtPlatform 인증기관에서 제공된 회원 식별번호
     * @param {string} platform 인증기관
     * @returns {Promise<{ memberExists: boolean } | string>} 회원가입 여부
     */
    static async getMemberByIdAtPlatform(idAtPlatform: string, platform: string): Promise<{ memberExists: boolean }> {
        const memberExists = await api.get(`/members/${idAtPlatform}?platform=${platform}`);

        if (memberExists.data.isSuccess) {
            return memberExists.data.data;
        } else {
            throw new Error(memberExists.data.message);
        }
    }

    /**
     * 회원 생성 API
     * @param {MemberInterface} member 회원가입할 회원정보
     * @returns {Promise<MemberInterface>} 생성된 회원 Promise 객체
     */
    static async createMember(member: MemberInterface): Promise<MemberInterface> {
        const createdMember = await api.post('/members', member);

        return createdMember.data.isSuccess ? createdMember.data.data : {};
    }
    
    /**
     * 회원 수정 API
     * @param {string} id 회원식별번호
     * @returns {Promise<MemberInterface>} 수정된 회원 Promise 객체
     */
    static async updateMember(id: string): Promise<MemberInterface> {
        const updatedMember = await api.patch('/members', {
            id,
            roleId: '202401211053010000000000000023',
            fullName: 'new_test_name',
            nickname: 'new_test_nickname',
        });

        return updatedMember.data.isSuccess ? updatedMember.data.data : {};
    }

    /**
     * 회원 삭제 API
     * @param id {string} 회원식별번호
     * @returns {Promise<boolean>} 삭제 요청 결과
     */
    static async deleteMember(id: string): Promise<boolean> {
        const result = await api.delete(`/members/${id}`);
        return result.data.isSuccess;
    }

    /**
     * API 서버로 네이버 Auth 요청을 요청
     * @param {string} code 네이버 로그인 인증 요청 API에서 리턴받은 인증코드 (발급 요청일 때 필수)
     * @returns 
     */
    static async getTokenFromServer(code: string): Promise<NaverTokenInterface> {
        const result = await api.post(`/members/oauth/naver?code=${code}`)

        return result.data.isSuccess ? JSON.parse(result.data.data) : {}
    }

    /**
     * API 서버로 네이버 Auth 요청을 요청
     * @param {string} tokenType 네이버 로그인 인증 요청 API에서 리턴받은 토큰의 타입
     * @param {string} accessToken 네이버 로그인 인증 요청 API에서 리턴받은 토큰
     * @returns 
     */
    static async getUserInfoFromServer(tokenType: string, accessToken: string): Promise<MemberInterface> {
        const result = await api.post(`/members/oauth/naver/user-info?token_type=${tokenType}&access_token=${accessToken}`);

        return result.data.isSuccess ? JSON.parse(result.data.data).response : {}
    }
}