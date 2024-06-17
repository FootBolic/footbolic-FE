import { PostInterface, PostSearchInterface } from "../../types/entity/post/PostInterface";
import api from "../api";

/**
 * 게시글 API 관리 클래스 
 */
export class PostAPI {
    /**
     * 게시글 목록 조회 API
     * @param {string | undefined} boardId 조회할 게시판 식별번호
     * @param {number} page 현재 페이지
     * @param {number} size 페이지당 결과 수
     * @param {PostSearchInterface} search 게시글 검색 파라미터 객체
     * @returns {Promise<{ posts: PostInterface[], size: number }>} 게시글 목록 및 전체 게시글 수 Promise 객체
     */
    static async getPosts(
        boardId: string | undefined,
        page: number,
        size: number,
        search: PostSearchInterface | undefined
    ): Promise<{ posts: PostInterface[], size: number }> {
        let url = `/posts?page=${page}&size=${size}`;
        url += search?.title ? `&searchTitle=${search.title}` : '';
        url += search?.createdBy ? `&searchCreatedBy=${search.createdBy}` : '';
        url += search?.createdAt ? `&searchCreatedAt=${search.createdAt}` : '';
        url += boardId ? `&boardId=${boardId}` : '';
        const response = await api.get(url);
        return response.data.data;
    }

    /**
     * 전체 게시글 목록 조회 API
     * @returns {Promise<{ posts: PostInterface[] }>} 전체 게시글 목록 Promise 객체
     */
    static async getAllposts(): Promise<{ posts: PostInterface[] }> {
        const response = await api.get('/posts/all');
        return response.data.data;
    }

    /**
     * 게시글 식별번호로 게시글 정보 조회
     * @param {string} id 조회할 게시글 식별번호
     * @returns {Promise<{ post: PostInterface }>} 조회한 게시글 정보
     */
    static async getPost(id: string): Promise<{ post: PostInterface }> {
        const response = await api.get(`/posts/${id}`);
        return response.data.data
    }

    /**
     * 게시글 생성 API
     * @param {PostInterface} post 생성할 게시글 정보
     * @returns {Promise<{ createdPost: PostInterface }>} 생성된 게시글 정보
     */
    static async createPost(post: PostInterface): Promise<{ createdPost: PostInterface }> {
        const response = await api.post('/posts', post);
        return response.data.data;
    }

    /**
     * 게시글 수정 API
     * @param {PostInterface} post 수정할 게시글 정보
     * @returns {Promise<{ updatedPost: PostInterface }>} 수정된 게시글 정보
     */
    static async updatePost(post: PostInterface): Promise<{ updatedPost: PostInterface }> {
        const response = await api.patch('/posts', post);
        return response.data.data;
    }

    /**
     * 게시글 삭제 API
     * @param {string} id 삭제할 게시글 식별번호
     * @returns {Promise<{ id: string}>} 삭제 요청 성공 여부
     */
    static async deletePost(id: string): Promise<{ id: string}> {
        const response = await api.delete(`/posts/${id}`);
        return response.data.data;
    }
}