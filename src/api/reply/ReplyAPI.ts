import { ReplyInterface } from "../../types/entity/reply/ReplyInterface";
import api from "../api";

/**
 * 답글 API 관리 클래스
 */
export class ReplyAPI {
    /**
     * 답글을 생성한다.
     * @param {ReplyInterface } reply 생성할 답글
     * @returns {Promise<{ createdReply: ReplyInterface }>} 생성된 답글
     */
    static async createReply(reply: ReplyInterface): Promise<{ createdReply: ReplyInterface }> {
        const response = await api.post('/replies', reply);
        return response.data.data;
    }

    /**
     * 답글을 수정한다.
     * @param {ReplyInterface } reply 수정할 답글
     * @returns {Promise<{ updatedReply: ReplyInterface }>} 수정된 답글
     */
    static async updateReply(reply: ReplyInterface): Promise<{ updatedReply: ReplyInterface }> {
        const response = await api.patch('/replies', reply);
        return response.data.data;
    }

    /**
     * 답글을 삭제한다.
     * @param {string} id 삭제할 답글 식별번호
     * @returns {Promise<{ id: string}>} 삭제 요청 성공 여부
     */
    static async deleteReply(id: string): Promise<{ id: string}> {
        const response = await api.delete(`/replies/${id}`);
        return response.data.data;
    }
}