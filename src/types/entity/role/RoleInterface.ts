import { AuthorizationInterface } from "../authorizations/AuthorizationInterface";
import { MemberInterface } from "../member/MemberInterface";

export interface RoleInterface {
    id: string;
    title?: string;
    isDefault?: boolean;
    members?: MemberInterface[];
    authorizations?: AuthorizationInterface[];
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}

export interface RoleSearchInterface {
    title?: string;
    authorizationId?: string;
}