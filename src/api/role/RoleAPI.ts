import { RoleInterface, RoleSearchInterface } from "../../types/entity/role/RoleInterface";
import api from "../api";

/**
 * 역할 API 관리 클래스
 */
export class RoleAPI {
    /**
     * 역할 목록 조회 API
     * @param {number} page 현재 페이지
     * @param {number} size 페이지당 결과 수
     * @param {RoleSearchInterface} search 역할 검색 파라미터 객체
     * @returns {Promise<{ roles: RoleInterface[], size: number }>} 역할 목록 및 전체 역할 수 Promise 객체
     */
    static async getRoles(
        page: number,
        size: number,
        search: RoleSearchInterface | undefined
    ): Promise<{ roles: RoleInterface[], size: number }> {
        let url = `/roles?page=${page}&size=${size}`;
        url += search?.title ? `&searchTitle=${search.title}` : '';
        url += search?.authorizationId ? `&searchAuthorizationId=${search.authorizationId}` : '';
        const response = await api.get(url);
        return response.data.data;
    }

    /**
     * 전체 역할 목록 조회 API
     * @returns {Promise<{ roles: RoleInterface[] }>} 전체 역할 목록 Promise 객체
     */
    static async getAllRoles(): Promise<{ roles: RoleInterface[] }> {
        const response = await api.get('/roles/all');
        return response.data.data;
    }

    /**
     * 역할 식별번호로 역할 정보 조회
     * @param {string} id 조회할 역할 식별번호
     * @returns {Promise<{ role: RoleInterface }>} 조회한 역할 정보
     */
    static async getRole(id: string): Promise<{ role: RoleInterface }> {
        const response = await api.get(`/roles/${id}`);
        return response.data.data
    }

    /**
     * 역할 생성 API
     * @param {RoleInterface} role 생성할 역할 정보
     * @returns {Promise<{ createdRole: RoleInterface }>} 생성된 역할 정보
     */
    static async createRole(role: RoleInterface): Promise<{ createdRole: RoleInterface }> {
        const response = await api.post('/roles', role);
        return response.data.data;
    }

    /**
     * 역할 수정 API
     * @param {RoleInterface} role 수정할 역할 정보
     * @returns {Promise<{ updatedRole: RoleInterface }>} 수정된 역할 정보
     */
    static async updateRole(role: RoleInterface): Promise<{ updatedRole: RoleInterface }> {
        const response = await api.patch('/roles', role);
        return response.data.data;
    }

    /**
     * 역할 삭제 API
     * @param {string} id 삭제할 역할 식별번호
     * @returns {Promise<{ id: string }>} 삭제 요청 성공 여부
     */
    static async deleteRole(id: string): Promise<{ id: string }> {
        const response = await api.delete(`/roles/${id}`);
        return response.data.data;
    }
}