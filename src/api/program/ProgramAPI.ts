import { ProgramInterface, ProgramSearchInterface } from "../../types/entity/program/ProgramInterface";
import api from "../api";

/**
 * 프로그램 관리 API
 */
export class ProgramAPI {
    /**
     * 프로그램 목록 조회 API
     * @param {number} page 현재 페이지
     * @param {number} size 페이지당 결과 수
     * @param {ProgramSearchInterface} search 프로그램 검색 파라미터 객체
     * @returns {Promise<{ programs: ProgramInterface[], size: number }>} 프로그램 목록 및 전체 프로그램 수 Promise 객체
     */
    static async getPrograms(
        page: number,
        size: number,
        search: ProgramSearchInterface | undefined
    ): Promise<{ programs: ProgramInterface[], size: number }> {
        let url = `/programs?page=${page}&size=${size}`;
        url += search?.title ? `&searchTitle=${search.title}` : '';
        url += search?.code ? `&searchCode=${search.code}` : '';
        const response = await api.get(url);
        return response.data.data;
    }

    /**
     * 전체 프로그램 목록 조회 API
     * @returns {Promise<{ programs: ProgramInterface[] }>} 전체 프로그램 목록 Promise 객체
     */
    static async getAllprograms(): Promise<{ programs: ProgramInterface[] }> {
        const response = await api.get('/programs/all');
        return response.data.data;
    }

    /**
     * 프로그램 식별번호로 프로그램 정보 조회
     * @param {string} id 조회할 프로그램 식별번호
     * @returns {Promise<{ program: ProgramInterface }>} 조회한 프로그램 정보
     */
    static async getProgram(id: string): Promise<{ program: ProgramInterface }> {
        const response = await api.get(`/programs/${id}`);
        return response.data.data
    }

    /**
     * 프로그램 생성 API
     * @param {ProgramInterface} program 생성할 프로그램 정보
     * @returns {Promise<{ createdProgram: ProgramInterface }>} 생성된 프로그램 정보
     */
    static async createProgram(program: ProgramInterface): Promise<{ createdProgram: ProgramInterface }> {
        const response = await api.post('/programs', program);
        return response.data.data;
    }

    /**
     * 프로그램 수정 API
     * @param {ProgramInterface} program 수정할 프로그램 정보
     * @returns {Promise<{ updatedProgram: ProgramInterface }>} 수정된 프로그램 정보
     */
    static async updateProgram(program: ProgramInterface): Promise<{ updatedProgram: ProgramInterface }> {
        const response = await api.patch('/programs', program);
        return response.data.data;
    }

    /**
     * 프로그램 삭제 API
     * @param {string} id 삭제할 프로그램 식별번호
     * @returns {Promise<{ id: string}>} 삭제 요청 성공 여부
     */
    static async deleteProgram(id: string): Promise<{ id: string}> {
        const response = await api.delete(`/programs/${id}`);
        return response.data.isSuccess;
    }
}