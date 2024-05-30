import { AuthorizationInterface, AuthorizationSearchInterface } from "../../types/entity/authorizations/AuthorizationInterface";
import api from "../api";

/**
 * 권한 API 관리 클래스
 */
export class AuthorizationAPI {
    /**
     * 권한 목록 조회 API
     * @param {number} page 현재 페이지
     * @param {number} size 페이지당 결과 수
     * @param {AuthorizationSearchInterface | undefined} searchParam 권한 검색 파라미터 객체
     * @returns {Promise<{ authorizations: AuthorizationInterface[], size: number }>} 권한 목록 및 전체 권한 수 Promise 객체
     */
    static async getAuthorizations(
        page: number,
        size: number,
        searchParam: AuthorizationSearchInterface | undefined
    ): Promise<{ authorizations: AuthorizationInterface[], size: number }> {
        let url = `/authorizations?page=${page}&size=${size}`;
        url += searchParam?.title ? '&searchTitle=' + searchParam.title : '';
        url += searchParam?.menuId ? '&searchMenuId=' + searchParam.menuId : '';
        const response = await api.get(url);
        return response.data.data;
    }
    /**
     * 권한 전체 목록 조회 API
     * @returns {Promise<{ authorizations: AuthorizationInterface[] }>} 권한 목록 및 전체 권한 수 Promise 객체
     */
    static async getAllAuthorizations(): Promise<{ authorizations: AuthorizationInterface[] }> {
        const response = await api.get('/authorizations/all');
        return response.data.data;
    }

    /**
     * 권한 식별번호로 권한 정보 조회
     * @param {string} id 조회할 대상 권한 식별번호
     * @returns {Promise<AuthorizationInterface>} 조회된 권한 정보
     */
    static async getAuthorization(id: string): Promise<AuthorizationInterface> {
        const response = await api.get(`/authorizations/${id}`);
        return response.data.data;
    }

    /**
     * 권한 생성 API
     * @param {AuthorizationInterface} authorization 생성할 권한 정보
     * @returns {Promise<AuthorizationInterface>} 생성된 권한 정보
     */
    static async createAuthorization(authorization: AuthorizationInterface): Promise<AuthorizationInterface> {
        const response = await api.post('/authorizations', authorization);
        return response.data.data;
    }

    /**
     * 권한 수정 API
     * @param {AuthorizationInterface} authorization 수정할 권한 정보
     * @returns {Promise<AuthorizationInterface>} 수정된 권한 정보
     */
    static async updateAuthorization(authorization: AuthorizationInterface): Promise<AuthorizationInterface> {
        const response = await api.patch('/authorizations', authorization);
        return response.data.data;
    }

    /**
     * 권한 삭제 API
     * @param {string} id 삭제할 권한 식별번호
     * @returns {Promise<boolean>} 삭제 요청 성공 여부
     */
    static async deleteAuthorization(id: string): Promise<boolean> {
        const response = await api.delete(`/authorizations/${id}`);
        return response.data.isSuccess;
    }
}