import { KakaoTokenInterface, KakaoUserInfoInterface } from "../../types/common/KakaoApiInterface";
import { kakaoApi, kakaoAuthApi } from "../api";


export class KakaoAuthApi {
    /**
     * 카카오 API 로그인/회원가입 시 토큰 받아오기
     * @param {string} code 카카오 API로 부터 받은 코드
     * @returns {Promise<KakaoTokenInterface>} 카카오 API로 부터 받은 토큰 정보
     */
    static async requestToken (code: string): Promise<KakaoTokenInterface> {
        const result = await kakaoAuthApi.post('/oauth/token', {
            code,
            grant_type: 'authorization_code',
            client_id: import.meta.env.VITE_KAKAO_API_KEY,
            client_secret: import.meta.env.VITE_KAKAO_CLIENT_SECRET,
            redirect_uri: import.meta.env.VITE_KAKAO_RET_URI
        });

        return result.data;
    }

    /**
     * 카카오 API 회원정보 조회
     * @param {string} accessToken 카카오 API로 부터 받은 액세스 토큰
     * @returns {Promise<KakaoUserInfoInterface>} 카카오 API로 부터 받은 사용자 정보
     */
    static async getUserInfo (accessToken: string): Promise<KakaoUserInfoInterface> {
        const result = await kakaoApi.post('/v2/user/me', null, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return result.data
    }

    /**
     * 카카오 API에 로그아웃 요청
     * @param {string} accessToken 카카오 API로 부터 받은 액세스 토큰
     */
    static async invalidateToken(accessToken: string): Promise<void> {
        kakaoApi.post('/v1/user/logout', null, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
}