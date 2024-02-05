import { MemberInterface } from "../member/MemberInterface";

export interface MenuInterface {
    id: string;
    parentId?: string;
    children?: MenuInterface[];
    parent?: MenuInterface;
    title: string;
    path?: string;
    iconCodeId?: string;
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}