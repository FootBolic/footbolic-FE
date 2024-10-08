import { MemberInterface } from "../member/MemberInterface";
import { MenuInterface } from "../menu/MenuInterface";

export interface AuthorizationInterface {
    id: string;
    title?: string;
    menuId?: string;
    menu?: MenuInterface;
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
    isNew?: boolean;
    isDeleted?: boolean;
}

export interface AuthorizationSearchInterface {
    title?: string;
    menuId?: string;
}