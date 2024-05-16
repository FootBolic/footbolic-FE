import { MenuInterface } from "../../types/entity/menu/MenuInterface";
import api from "../api";

export class MenuAPI {
    /**
     * 메뉴 목록 조회 API
     * @returns {Promise<MenuInterface[]>} 메뉴 목록 Promise 객체
     */
    static async getMenus(): Promise<MenuInterface[]> {
        const response = await api.get('/menus');
        return response.data.data;
    }

    /**
     * 메뉴 생성 API
     * @param {MenuInterface} menu 생성할 메뉴 객체
     * @returns {Promise<MenuInterface>} 생성된 메뉴 Promise 객체
     */
    static async createMenu(menu: MenuInterface): Promise<MenuInterface> {
        const response = await api.post('/menus', menu);
        return response.data.data;
    }

    /**
     * 메뉴 단건 조회 API
     * @param {string} id 조회할 메뉴 식별번호
     * @returns {Promise<MenuInterface>} 조회된 메뉴 Promise 객체
     */
    static async getMenuById(id: string): Promise<MenuInterface> {
        const response = await api.get(`/menus/${id}`);
        return response.data.data;
    }
    
    /**
     * 메뉴 수정 API
     * @param {MenuInterface} 수정될 메뉴 객체
     * @returns {Promise<MenuInterface>} 수정된 메뉴 Promise 객체
     */
    static async updateMenu(menu: MenuInterface): Promise<MenuInterface> {
        const response = await api.patch('/menus', menu);
        return response.data.data;
    }

    /**
     * 메뉴 삭제 API
     * @param {string} id 메뉴식별번호
     * @returns {Promise<boolean>} 삭제 요청 결과
     */
    static async deleteMenu(id: string): Promise<boolean> {
        await api.delete(`/menus/${id}`);
        return true;
    }
}