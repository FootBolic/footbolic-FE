import { NaverTokenInterface } from "../../types/common/NaverApiInterface";
import { MemberInterface } from "../../types/entity/member/MemberInterface";
import api from "../api";

/**
 * 회원 API 관리 클래스
 */
export class MemberAPI {
    /**
     * 회원 목록 조회 API
     * @param {number} page 현재 페이지
     * @param {number} size 페이지당 결과 수
     * @returns {Promise<MemberInterface[]>} 회원 목록 Promise 객체
     */
    static async getMembers(page: number, size: number): Promise<{ members: MemberInterface[], size: number }> {
        const response = await api.get(`/members?page=${page}&size=${size}`);
        return response.data.data;
    }

    static async getMember(id: string): Promise<MemberInterface> {
        const response = await api.get(`/members/${id}`);
        return response.data.data;
    }

    /**
     * Access Token으로 회원 정보 조회
     * @returns {Promise<MemberInterface>} 조회된 회원 정보
     */
    static async getTokenMember(): Promise<MemberInterface> {
        const response = await api.post('/members/me');
        return response.data.data;
    }

    /**
     * 인증기관과 인증기관에서 제공 받은 회원 식별번호로 회원가입 여부 조회
     * @param {string} idAtPlatform 인증기관에서 제공된 회원 식별번호
     * @param {string} platform 인증기관
     * @returns {Promise<{ memberExists: boolean } | string>} 회원가입 여부
     */
    static async getMemberByIdAtPlatform(idAtPlatform: string, platform: string): Promise<{ memberExists: boolean }> {
        const response = await api.get(`/members/public/${idAtPlatform}?platform=${platform}`);
        return response.data.data;
    }

    /**
     * 회원 생성 API
     * @param {MemberInterface} member 회원가입할 회원정보
     * @returns {Promise<MemberInterface>} 생성된 회원 Promise 객체
     */
    static async createMember(member: MemberInterface): Promise<MemberInterface> {
        const response = await api.post('/members', member);
        return response.data.data;
    }

    static async updateTokenMember(member: MemberInterface): Promise<MemberInterface> {
        const response = await api.patch('/members/me', member);
        return response.data.data;
    }
    
    /**
     * 회원 수정 API
     * @param {MemberInterface} member 수정된 회원
     * @returns {Promise<MemberInterface>} 수정된 회원 Promise 객체
     */
    static async updateMember(member: MemberInterface): Promise<MemberInterface> {
        const updatedMember = await api.patch('/members', member);
        return updatedMember.data.data;
    }

    /**
     * 회원 삭제 API
     * @param id {string} 회원식별번호
     * @returns {Promise<boolean>} 삭제 요청 결과
     */
    static async deleteMember(id: string): Promise<boolean> {
        await api.delete(`/members/${id}`);
        return true;
    }

    /**
     * API 서버로 네이버 Auth 요청을 요청
     * @param {string} code 네이버 로그인 인증 요청 API에서 리턴받은 인증코드 (발급 요청일 때 필수)
     * @returns {Promise<NaverTokenInterface>} 네이버에서 발급한 토큰정보
     */
    static async getTokenFromServer(code: string): Promise<NaverTokenInterface> {
        const response = await api.post(`/members/public/oauth/naver?code=${code}`);
        return JSON.parse(response.data.data);
    }

    /**
     * API 서버로 네이버 Auth 요청을 요청
     * @param {string} tokenType 네이버 로그인 인증 요청 API에서 리턴받은 토큰의 타입
     * @param {string} accessToken 네이버 로그인 인증 요청 API에서 리턴받은 토큰
     * @returns {Promise<MemberInterface>} 조회된 회원정보
     */
    static async getUserInfoFromServer(tokenType: string, accessToken: string): Promise<MemberInterface> {
        const response = await api.post(`/members/public/oauth/naver/user-info?token_type=${tokenType}&access_token=${accessToken}`);
        return JSON.parse(response.data.data).response;
    }

    /**
     * 회원의 회원가입 플랫폼 조회
     * @returns {Promise<string>} 회원의 회원가입 플랫폼
     */
    static async checkPlatform(): Promise<string> {
        const response = await api.post('/members/me/platform');
        return response.data.data.platform;
    }
    
    /**
     * 회원 탈퇴 API
     * @param {string} accessToken 로그인 API에서 받은 Access Token
     * @returns {Promise<{ id: string }>} 회원 탈퇴 성공한 회원의 식별번호
     */
    static async withdrawTokenMember(accessToken: string): Promise<{ id: string }> {
        const response = await api.delete(`/members/me?access_token=${accessToken}`);
        return response.data.data;
    }
}