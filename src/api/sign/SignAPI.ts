import { AccessTokenInfoInterface } from "../../types/common/AccessTokenInfoInterface";
import { MemberInterface } from "../../types/entity/member/MemberInterface";
import api from "../api";

/**
 * 로그인/로그아웃 처리 API 관리 클래스
 */
export class SignAPI {
    /**
     * 로그인 요청 API
     * @param {MemberInterface} member 회원 정보
     * @returns {Promise<AccessTokenInfoInterface>} 로그인 결과 반환된 access token 정보
     */
    static async signIn(member: MemberInterface): Promise<AccessTokenInfoInterface> {
        const result = await api.post('/sign/in', member);
        return result.data.data;
    }

    /**
     * 로그아웃 요청 API
     * @returns {Promise<boolean>} 로그아웃 성공여부
     */
    static async signOut():Promise<boolean> {
        return await api.post('/sign/out');
    }

    /**
     * 쿠키에 refresh Token 존재 여부를 확인한다.
     * @returns {Promise<boolean>} 쿠키에 refresh Token 존재 여부
     */
    static async checkRefreshToken():Promise<boolean> {
        const response = await api.post('/sign/check');
        return response.data.data.check_result;
    }

    static async renew():Promise<AccessTokenInfoInterface> {
        const response = await api.post('/sign/renew');
        return response.data.data;
    }
}