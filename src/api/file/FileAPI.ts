import { FileInterface } from "../../types/entity/file/FileInterface";
import api, { fileApi } from "../api";

/**
 * 파일 API 관리 클래스 
 */
export class FileAPI {
    /**
     * 파일 식별번호로 파일 정보 조회
     * @param {string} id 조회할 파일 식별번호
     * @returns {Promise<{ file: FileInterface }>} 조회한 파일 정보
     */
    static async getFile(id: string): Promise<{ file: FileInterface }> {
        const response = await api.get(`/files/${id}`);
        return response.data.data
    }

    /**
     * 파일 생성 API
     * @param {FormData} file 생성할 파일 정보
     * @returns {Promise<{ createdFile: FileInterface }>} 생성된 파일 정보
     */
    static async createFile(file: FormData): Promise<{ createdFile: FileInterface }> {
        const response = await fileApi.post('/files', file);
        return response.data.data;
    }

    /**
     * 파일 삭제 API
     * @param {string} id 삭제할 파일 식별번호
     * @returns {Promise<{ id: string}>} 삭제 요청 성공 여부
     */
    static async deleteFile(id: string): Promise<{ id: string}> {
        const response = await api.delete(`/files/${id}`);
        return response.data.data;
    }
}