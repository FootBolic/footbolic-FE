import { MemberInterface } from "../member/MemberInterface";
import { PostInterface } from "../post/PostInterface";
import { ReplyInterface } from "../reply/ReplyInterface";

export interface CommentInterface {
    id: string;
    postId?: string;
    post?: PostInterface;
    content?: string;
    isEditable?: boolean;
    replies?: ReplyInterface[];
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}