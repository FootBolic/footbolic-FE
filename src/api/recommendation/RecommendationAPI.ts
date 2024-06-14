import { RecommendationInterface } from "../../types/entity/recommendation/RecommendationInterface";
import api from "../api";

/**
 * 추천 API 관리 클래스
 */
export class RecommendationAPI {
    /**
     * 게시글, 댓글, 답글 추천을 조회한다
     * @param {"post" | "comment" | "reply"} type 조회할 추천 객체 타입
     * @param {string} objectId 조회할 추천 객체 식별번호
     * @returns {Promise<{ recommendations: RecommendationInterface[], size: number, isRecommended: boolean }>} 조회된 추천 객체 목록과 추천 수 Promise 객체
     */
    static async getRecommendations(
        type: "post" | "comment" | "reply",
        objectId: string
    ): Promise<{ recommendations: RecommendationInterface[], size: number, isRecommended: boolean }> {
        const response = await api.get(`/recommendations/${type}/${objectId}`);
        return response.data.data;
    }

    /**
     * 게시글, 댓글, 답글을 추천한다
     * @param {"post" | "comment" | "reply"} type 추천할 객체 타입
     * @param {string} objectId 추천할 객체 식별번호
     * @returns {Promise<{ createdRecommendation: RecommendationInterface }>} 생성된 추천 객체
     */
    static async recommend(type: "post" | "comment" | "reply", objectId: string): Promise<{ createdRecommendation: RecommendationInterface }> {
        const response = await api.post(`/recommendations/${type}/${objectId}`);
        return response.data.data;
    }

    /**
     * 게시글, 댓글, 답글을 추천 취소한다
     * @param {"post" | "comment" | "reply"} type 추천 취소할 객체 타입
     * @param {string} objectId 추천 취소할 객체 식별번호
     * @returns {Promise<{ id: string }>} 취소된 추천 식별번호
     */
    static async unrecommend(type: string, objectId: string): Promise<{ id: string; }> {
        const response = await api.delete(`/recommendations/${type}/${objectId}`);
        return response.data.data;
    }
}