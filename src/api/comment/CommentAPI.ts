import { CommentInterface } from "../../types/entity/comment/CommentInterface";
import api from "../api";

/**
 * 댓글 API 관리 클래스
 */
export class CommentAPI {
    /**
     * 댓글을 생성한다.
     * @param {CommentInterface} comment 생성할 댓글
     * @returns {Promise<{ createdComment: CommentInterface}>} 생성된 댓글
     */
    static async createComment(comment: CommentInterface): Promise<{ createdComment: CommentInterface}> {
        const response = await api.post('/comments', comment);
        return response.data.data;
    }

    /**
     * 댓글을 수정한다.
     * @param {CommentInterface} comment 수정할 댓글
     * @returns {Promise<{ updatedComment: CommentInterface}>} 수정된 댓글
     */
    static async updateComment(comment: CommentInterface): Promise<{ updatedComment: CommentInterface}> {
        const response = await api.patch('/comments', comment);
        return response.data.data;
    }

    /**
     * 댓글을 삭제한다.
     * @param {string} id 삭제할 댓글 식별번호
     * @returns {Promise<{ id: string}>} 삭제 요청 성공 여부
     */
    static async deleteComment(id: string): Promise<{ id: string}> {
        const response = await api.delete(`/comments/${id}`);
        return response.data.data;
    }
}