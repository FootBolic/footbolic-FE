import { IconInterface, IconSearchInterface } from "../../types/entity/icon/IconInterface";
import api from "../api";

/**
 * 아이콘 API 관리 클래스 
 */
export class IconAPI {
    /**
     * 아이콘 목록 조회 API
     * @param {string | undefined} boardId 조회할 게시판 식별번호
     * @param {number} page 현재 페이지
     * @param {number} size 페이지당 결과 수
     * @param {IconSearchInterface} search 아이콘 검색 파라미터 객체
     * @returns {Promise<{ Icons: IconInterface[], size: number }>} 아이콘 목록 및 전체 아이콘 수 Promise 객체
     */
    static async getIcons(
        page: number,
        size: number,
        search: IconSearchInterface | undefined
    ): Promise<{ icons: IconInterface[], size: number }> {
        let url = `/icons?page=${page}&size=${size}`;
        url += search?.title ? `&searchTitle=${search.title}` : '';
        url += search?.code ? `&searchCode=${search.code}` : '';
        const response = await api.get(url);
        return response.data.data;
    }

    /**
     * 아이콘 식별번호로 아이콘 정보 조회
     * @param {string} id 조회할 아이콘 식별번호
     * @returns {Promise<{ icon: IconInterface }>} 조회한 아이콘 정보
     */
    static async getIcon(id: string): Promise<{ icon: IconInterface }> {
        const response = await api.get(`/icons/${id}`);
        return response.data.data
    }

    /**
     * 아이콘 생성 API
     * @param {IconInterface} icon 생성할 아이콘 정보
     * @returns {Promise<{ createdIcon: IconInterface }>} 생성된 아이콘 정보
     */
    static async createIcon(icon: IconInterface): Promise<{ createdIcon: IconInterface }> {
        const response = await api.post('/icons', icon);
        return response.data.data;
    }

    /**
     * 아이콘 수정 API
     * @param {IconInterface} Icon 수정할 아이콘 정보
     * @returns {Promise<{ updatedIcon: IconInterface }>} 수정된 아이콘 정보
     */
    static async updateIcon(icon: IconInterface): Promise<{ updatedIcon: IconInterface }> {
        const response = await api.patch('/icons', icon);
        return response.data.data;
    }

    /**
     * 아이콘 삭제 API
     * @param {string} id 삭제할 아이콘 식별번호
     * @returns {Promise<{ id: string}>} 삭제 요청 성공 여부
     */
    static async deleteIcon(id: string): Promise<{ id: string}> {
        const response = await api.delete(`/icons/${id}`);
        return response.data.data;
    }
}