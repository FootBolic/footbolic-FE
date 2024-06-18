import { MemberInterface } from "../member/MemberInterface";

export interface IconInterface {
    id: string;
    title?: string;
    code?: string;
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}

export interface IconSearchInterface {
    title?: string;
    code?: string;
}