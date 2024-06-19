import { BoardInterface } from "../board/BoardInterface";
import { IconInterface } from "../icon/IconInterface";
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
    detailId?: string;
    detail?: BoardInterface;
    iconId?: string;
    icon?: IconInterface;
    isUsed?: boolean;
    order? : number;
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}