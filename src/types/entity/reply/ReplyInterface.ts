import { CommentInterface } from "../comment/CommentInterface";
import { MemberInterface } from "../member/MemberInterface";

export interface ReplyInterface {
    id: string;
    commentId?: string;
    comment?: CommentInterface;
    content?: string;
    isEditable?: boolean;
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}