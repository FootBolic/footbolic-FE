import { MemberInterface } from "../member/MemberInterface";

export interface MenuInterface {
    [key: string]: any;
    id: string;
    parentId?: string;
    children?: MenuInterface[];
    parent?: MenuInterface;
    title: string;
    path?: string;
    iconCodeId?: string;
    isUsed?: boolean;
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}