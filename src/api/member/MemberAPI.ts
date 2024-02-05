import { MemberInterface } from "../../types/entity/member/MemberInterface";
import { api } from "../api";

export class MemberAPI {
    /**
     * 회원 목록 조회 API
     * @returns {Promise<MemberInterface[]>} 회원 목록 Promise 객체
     */
    static async getMembers(): Promise<MemberInterface[]> {
        const members = await api.get('/members');

        if (members.data.success) {
            return members.data.data;
        } else {
            return [];
        }
    }

    /**
     * 회원 생성 API
     * @returns {Promise<MemberInterface>} 생성된 회원 Promise 객체
     */
    static async createMember(): Promise<MemberInterface> {
        const createdMember = await api.post('/members', {
            roleId: '202401211053010000000000000023',
            fullName: 'test_name',
            nickname: 'test_nickname',
        });

        return createdMember.data.success ? createdMember.data.data : {};
    }
    
    /**
     * 회원 수정 API
     * @param id {string} 회원식별번호
     * @returns {Promise<MemberInterface>} 수정된 회원 Promise 객체
     */
    static async updateMember(id: string): Promise<MemberInterface> {
        const updatedMember = await api.patch('/members', {
            id,
            roleId: '202401211053010000000000000023',
            fullName: 'new_test_name',
            nickname: 'new_test_nickname',
        });

        return updatedMember.data.success ? updatedMember.data.data : {};
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