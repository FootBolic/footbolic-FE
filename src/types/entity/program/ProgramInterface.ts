import { MemberInterface } from "../member/MemberInterface";
import { MenuInterface } from "../menu/MenuInterface";

export interface ProgramInterface {
    id: string;
    title?: string;
    code?: string;
    path?: string;
    menus?: MenuInterface[];
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}

export interface ProgramSearchInterface {
    title?: string;
    code?: string;
}