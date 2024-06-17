import { MemberInterface } from "../member/MemberInterface";

export interface FileInterface {
    id: string;
    originalName?: string;
    newName?: string;
    type?: string;
    size?: number;
    path?: string;
    extension?: string;
    targetFile?: FormData;
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}