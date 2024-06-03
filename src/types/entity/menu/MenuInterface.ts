import { MemberInterface } from "../member/MemberInterface";
import { ProgramInterface } from "../program/ProgramInterface";

export interface MenuInterface {
    [key: string]: any;
    id: string;
    parentId?: string;
    children?: MenuInterface[];
    parent?: MenuInterface;
    title: string;
    programId?: string;
    program?: ProgramInterface;
    path?: string;
    iconCodeId?: string;
    isUsed?: boolean;
    order? : number;
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}