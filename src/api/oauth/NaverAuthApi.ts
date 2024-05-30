import { NaverTokenInterface } from "../../types/common/NaverApiInterface";
import { naverApi, naverAuthApi } from "../api";


export class NaverAuthAPI {
    /**
     * 내이버 API에 토큰을 발급, 갱신, 삭제 요청한다.
     * @param {'authorization_code' | 'refresh_token' | 'delete'} requestType 요청 타입 (authorization_code: 발급, refresh_token: 갱신, delete: 삭제)
     * @param {string} code 로그인 인증 요청 API에서 리턴받은 인증코드 (발급 요청일 때 필수)
     * @returns {Promise<NaverTokenInterface>} 네이버 API에서 발급한 토큰 정보 또는 삭제 결과
     */
    static async requestToken(requestType: string, code: string): Promise<NaverTokenInterface> {
        const result = await naverAuthApi.post('/oauth2.0/token', {
            grant_type: requestType,
            client_id: import.meta.env.VITE_NAVER_CLIENT_ID,
            client_secret: import.meta.env.VITE_NAVER_CLIENT_SECRET,
            code
        })

        return result.data;
    }

    static async getUserInfo(token_type: string, access_token: string) {
        const result = await naverApi.post('/v1/nid/me', null, {
            headers: {
                Authorization: `${token_type} ${access_token}`
            }
        })

        return result.data;
    }
}