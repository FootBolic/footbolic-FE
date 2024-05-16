import { MenuInterface } from "../../types/entity/menu/MenuInterface";
import api from "../api";

export class MenuAPI {
    /**
     * 메뉴 목록 조회 API
     * @returns {Promise<MenuInterface[]>} 메뉴 목록 Promise 객체
     */
    static async getMenus(): Promise<MenuInterface[]> {
        const menus = await api.get('/menus');
        return menus.data.isSuccess ? menus.data.data : [];
    }

    /**
     * 메뉴 생성 API
     * @param {MenuInterface} 생성할 메뉴 객체
     * @returns {Promise<MenuInterface>} 생성된 메뉴 Promise 객체
     */
    static async createMenu({ parentId, title, path, iconCodeId, isUsed, createMemberId }: MenuInterface): Promise<MenuInterface> {
        const createdMenu = await api.post('/menus', {
            parentId,
            title,
            path,
            iconCodeId,
            isUsed,
            createMemberId,
        });

        return createdMenu.data.isSuccess ? createdMenu.data.data : [];
    }

    /**
     * 메뉴 단건 조회 API
     * @param {string} id 조회할 메뉴 식별번호
     * @returns {Promise<MenuInterface>} 조회된 메뉴 Promise 객체
     */
    static async getMenuById(id: string): Promise<MenuInterface> {
        const menu = await api.get(`/menus/${id}`);
        return menu.data.isSuccess ? menu.data.data : {};
    }
    
    /**
     * 메뉴 수정 API
     * @param {MenuInterface} 수정될 메뉴 객체
     * @returns {Promise<MenuInterface>} 수정된 메뉴 Promise 객체
     */
    static async updateMenu({ id, parentId, title, path, iconCodeId, isUsed, updateMemberId }: MenuInterface): Promise<MenuInterface> {
        const updatedMenu = await api.patch('/menus', {
            id,
            parentId,
            title,
            path,
            iconCodeId,
            isUsed,
            updateMemberId
        });

        return updatedMenu.data.isSuccess ? updatedMenu.data.data : {};
    }

    /**
     * 메뉴 삭제 API
     * @param {string} id 메뉴식별번호
     * @returns {Promise<boolean>} 삭제 요청 결과
     */
    static async deleteMenu(id: string): Promise<boolean> {
        const result = await api.delete(`/menus/${id}`);
        return result.data.isSuccess;
    }
}