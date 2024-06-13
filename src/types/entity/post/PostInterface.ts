import { BoardInterface } from "../board/BoardInterface";
import { CommentInterface } from "../comment/CommentInterface";
import { MemberInterface } from "../member/MemberInterface";

export interface PostInterface {
    id: string;
    boardId?: string;
    board?: BoardInterface;
    title?: string;
    content?: string;
    isSecret?: boolean;
    isAnnouncement?: boolean;
    isEditable?: boolean;
    announcementStartsAt?: number[];
    announcementEndsAt?: number[];
    comments?: CommentInterface[];
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}

export interface PostSearchInterface {
    title?: string;
    createdBy?: string;
    createdAt?: string | number[] | Date;
}