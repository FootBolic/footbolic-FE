import { MemberInterface } from "../member/MemberInterface";
import { MenuInterface } from "../menu/MenuInterface";

export interface IconInterface {
    id: string;
    title?: string;
    code?: string;
    type?: string;
    menus?: MenuInterface[];
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