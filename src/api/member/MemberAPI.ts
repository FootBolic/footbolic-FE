import { api } from "../api";


export class MemberAPI {
    /**
     * 회원 목록 API
     * @returns 회원 목록
     */
    static async getMembers() {
        return await api.get('/members');
    }

    /**
     * 회원 생성 API
     * @returns 생성된 회원
     */
    static async createMember() {
        return await api.post('/members', {
            roleId: '202401211053010000000000000023',
            fullName: 'test_name',
            nickname: 'test_nickname',
        });
    }
    
    /**
     * 회원 수정 API
     * @param id {string} 회원식별번호
     * @returns 수정된 회원
     */
    static async updateMember(id: string) {
        return await api.patch('/members', {
            id,
            roleId: '202401211053010000000000000023',
            fullName: 'new_test_name',
            nickname: 'new_test_nickname',
        });
    }

    static async deleteMember(id: string) {
        api.delete(`/members/${id}`)
    }
}