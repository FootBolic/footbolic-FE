import { BoardInterface, BoardSearchInterface } from "../../types/entity/board/BoardInterface";
import api from "../api";

/**
 * 게시판 API 관리 클래스
 */
export class BoardAPI {
    /**
     * 게시판 목록 조회 API
     * @param {number} page 현재 페이지
     * @param {number} size 페이지당 결과 수
     * @param {BoardSearchInterface} search 게시판 검색 파라미터 객체
     * @returns {Promise<{ boards: BoardInterface[], size: number }>} 게시판 목록 및 전체 게시판 수 Promise 객체
     */
    static async getBoards(
        page: number,
        size: number,
        search: BoardSearchInterface | undefined
    ): Promise<{ boards: BoardInterface[], size: number }> {
        let url = `/boards?page=${page}&size=${size}`;
        url += search?.title ? `&searchTitle=${search.title}` : '';
        const response = await api.get(url);
        return response.data.data;
    }

    /**
     * 전체 게시판 목록 조회 API
     * @returns {Promise<{ boards: BoardInterface[] }>} 전체 게시판 목록 Promise 객체
     */
    static async getAllboards(): Promise<{ boards: BoardInterface[] }> {
        const response = await api.get('/boards/all');
        return response.data.data;
    }

    /**
     * 게시판 식별번호로 게시판 정보 조회
     * @param {string} id 조회할 게시판 식별번호
     * @returns {Promise<{ board: BoardInterface }>} 조회한 게시판 정보
     */
    static async getBoard(id: string): Promise<{ board: BoardInterface }> {
        const response = await api.get(`/boards/${id}`);
        return response.data.data
    }

    /**
     * 게시판 생성 API
     * @param {BoardInterface} board 생성할 게시판 정보
     * @returns {Promise<{ createdBoard: BoardInterface }>} 생성된 게시판 정보
     */
    static async createBoard(board: BoardInterface): Promise<{ createdBoard: BoardInterface }> {
        const response = await api.post('/boards', board);
        return response.data.data;
    }

    /**
     * 게시판 수정 API
     * @param {BoardInterface} board 수정할 게시판 정보
     * @returns {Promise<{ updatedBoard: BoardInterface }>} 수정된 게시판 정보
     */
    static async updateBoard(board: BoardInterface): Promise<{ updatedBoard: BoardInterface }> {
        const response = await api.patch('/boards', board);
        return response.data.data;
    }

    /**
     * 게시판 삭제 API
     * @param {string} id 삭제할 게시판 식별번호
     * @returns {Promise<{ id: string}>} 삭제 요청 성공 여부
     */
    static async deleteBoard(id: string): Promise<{ id: string}> {
        const response = await api.delete(`/boards/${id}`);
        return response.data.data;
    }

    /**
     * 메인 페이지에 노출되는 게시판 목록 조회 API
     * @returns {Promise<{ boards: BoardInterface[] }>} 메인 페이지에 노출되는 게시판 목록 Promise 객체
     */
    static async getMainBoards(): Promise<{ boards: BoardInterface[] }> {
        const response = await api.get("/boards/public/main");
        return response.data.data;
    }
}