import { BannerInterface, BannerSearchInterface } from "../../types/entity/banner/BannerInterface";
import api from "../api";

/**
 * 배너 API 관리 클래스 
 */
export class BannerAPI {
    /**
     * 배너 목록 조회 API
     * @param {string | undefined} boardId 조회할 게시판 식별번호
     * @param {number} page 현재 페이지
     * @param {number} size 페이지당 결과 수
     * @param {BannerSearchInterface} search 배너 검색 파라미터 객체
     * @returns {Promise<{ banners: BannerInterface[], size: number }>} 배너 목록 및 전체 배너 수 Promise 객체
     */
    static async getBanners(
        page: number,
        size: number,
        search: BannerSearchInterface | undefined
    ): Promise<{ banners: BannerInterface[], size: number }> {
        let url = `/banners?page=${page}&size=${size}`;
        url += search?.title ? `&searchTitle=${search.title}` : '';
        url += search?.date ? `&searchDate=${search.date}` : '';
        const response = await api.get(url);
        return response.data.data;
    }

    /**
     * 배너 식별번호로 배너 정보 조회
     * @param {string} id 조회할 배너 식별번호
     * @returns {Promise<{ banner: BannerInterface }>} 조회한 배너 정보
     */
    static async getBanner(id: string): Promise<{ banner: BannerInterface }> {
        const response = await api.get(`/banners/${id}`);
        return response.data.data
    }

    /**
     * 배너 생성 API
     * @param {BannerInterface} banner 생성할 배너 정보
     * @returns {Promise<{ createdBanner: BannerInterface }>} 생성된 배너 정보
     */
    static async createBanner(banner: BannerInterface): Promise<{ createdBanner: BannerInterface }> {
        const response = await api.post('/banners', banner);
        return response.data.data;
    }

    /**
     * 배너 수정 API
     * @param {BannerInterface} banner 수정할 배너 정보
     * @returns {Promise<{ updatedBanner: BannerInterface }>} 수정된 배너 정보
     */
    static async updateBanner(banner: BannerInterface): Promise<{ updatedBanner: BannerInterface }> {
        const response = await api.patch('/banners', banner);
        return response.data.data;
    }

    /**
     * 배너 삭제 API
     * @param {string} id 삭제할 배너 식별번호
     * @returns {Promise<{ id: string}>} 삭제 요청 성공 여부
     */
    static async deleteBanner(id: string): Promise<{ id: string}> {
        const response = await api.delete(`/banners/${id}`);
        return response.data.data;
    }
}