import { MenuInterface } from "../../types/entity/menu/MenuInterface";
import api from "../api";

/**
 * 메뉴 API 관리 클래스
 */
export class MenuAPI {
    /**
     * 메뉴 목록 조회 API
     * @returns {Promise<{ menus: MenuInterface[] }>} 메뉴 목록 Promise 객체
     */
    static async getMenus(): Promise<{ menus: MenuInterface[] }> {
        const response = await api.get('/menus');
        return response.data.data;
    }

    /**
     * 권한을 가진 메뉴 목록 조회
     * @returns {Promise<{ menus: MenuInterface[] }>} 
     */
    static async getMenusByAuth(): Promise<{ menus: MenuInterface[] }> {
        const response = await api.get('/menus/public');
        return response.data.data;
    }

    /**
     * 메뉴 생성 API
     * @param {MenuInterface} menu 생성할 메뉴 객체
     * @returns {Promise<{ createdMenu: MenuInterface }>} 생성된 메뉴 Promise 객체
     */
    static async createMenu(menu: MenuInterface): Promise<{ createdMenu: MenuInterface }> {
        const response = await api.post('/menus', menu);
        return response.data.data;
    }

    /**
     * 메뉴 단건 조회 API
     * @param {string} id 조회할 메뉴 식별번호
     * @returns {Promise<{ menu: MenuInterface }>} 조회된 메뉴 Promise 객체
     */
    static async getMenu(id: string): Promise<{ menu: MenuInterface }> {
        const response = await api.get(`/menus/${id}`);
        return response.data.data;
    }

    /**
     * 프로그램 식별번호와 세부페이지 식별번호로 메뉴 중복 검사
     * @param {string} programId 조회할 메뉴 프로그램 식별번호
     * @param {string | undefined} detailId 조회할 세부페이지 식별번호
     * @param {string | undefined} menuId 중복검사에서 제외할 메뉴 식별번호
     * @returns {Promise<{ isDuplicate: boolean }>} 메뉴 중복 여부
     */
    static async isDuplicate(
        programId: string,
        detailId: string | undefined,
        menuId: string | undefined
    ): Promise<{ isDuplicate: boolean }> {
        let url = `/menus/${programId}`;
        if (detailId) url += `?detailId=${detailId}`;
        if (menuId) url+= (detailId ? '&' : '?') + `menuId=${menuId}`;
        const response = await api.post(url);
        return response.data.data;
    }

    /**
     * 경로에 해당하는 메뉴를 조회한다.
     * @param {string} path 메뉴를 조회할 대상 경로
     * @returns {Promise<{ menu: MenuInterface }>} 경로에 해당하는 메뉴
     */
    static async getMenuPath(path: string): Promise<{ menu: MenuInterface }> {
        const response = await api.get(`/menus/public/path?path=${path}`);
        return response.data.data
    }
    
    /**
     * 메뉴 수정 API
     * @param {MenuInterface} menu 수정될 메뉴 객체
     * @returns {Promise<{ updatedMenu: MenuInterface }>} 수정된 메뉴 Promise 객체
     */
    static async updateMenu(menu: MenuInterface): Promise<{ updatedMenu: MenuInterface }> {
        const response = await api.patch('/menus', menu);
        return response.data.data;
    }

    /**
     * 메뉴 삭제 API
     * @param {string} id 메뉴식별번호
     * @returns {Promise<{ id: string }>} 삭제된 메뉴 식별번호
     */
    static async deleteMenu(id: string): Promise<{ id: string }> {
        const response = await api.delete(`/menus/${id}`);
        return response.data.data;
    }
}