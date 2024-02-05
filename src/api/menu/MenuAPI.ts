import { MenuInterface } from "../../types/entity/menu/MenuInterface";
import { api } from "../api";

export class MenuAPI {
    /**
     * 메뉴 목록 조회 API
     * @returns {Promise<MenuInterface[]>} 메뉴 목록 Promise 객체
     */
    static async getMenus(): Promise<MenuInterface[]> {
        const menus = await api.get('/menus');
        return menus.data.success ? menus.data.data : [];
    }

    /**
     * 메뉴 생성 API
     * @param {MenuInterface} 생성할 메뉴 객체
     * @returns {Promise<MenuInterface>} 생성된 메뉴 Promise 객체
     */
    static async createMenu({ parentId, title, path, iconCodeId, createMemberId }: MenuInterface): Promise<MenuInterface> {
        const createdMenu = await api.post('/menus', {
            parentId,
            title,
            path,
            iconCodeId,
            createMemberId,
        });

        return createdMenu.data.success ? createdMenu.data.data : [];
    }

    /**
     * 메뉴 단건 조회 API
     * @param id {string} 조회할 메뉴 식별번호
     * @returns {Promise<MenuInterface>} 조회된 메뉴 Promise 객체
     */
    static async getMenuById(id: string): Promise<MenuInterface> {
        const menu = await api.get(`/menus/${id}`);
        return menu.data.success ? menu.data.data : {};
    }
    
    /**
     * 회원 수정 API
     * @param id {string} 회원식별번호
     * @returns {Promise<MenuInterface>} 수정된 회원 Promise 객체
     */
    static async updateMember({ id, parentId, title, path, iconCodeId, updateMemberId }: MenuInterface): Promise<MenuInterface> {
        const updatedMenu = await api.patch('/members', {
            id,
            parentId,
            title,
            path,
            iconCodeId,
            updateMemberId
        });

        return updatedMenu.data.success ? updatedMenu.data.data : {};
    }

    /**
     * 회원 삭제 API
     * @param id {string} 회원식별번호
     * @returns {Promise<boolean>} 삭제 요청 결과
     */
    static async deleteMember(id: string): Promise<boolean> {
        const result = await api.delete(`/members/${id}`);
        return result.data.success;
    }
}