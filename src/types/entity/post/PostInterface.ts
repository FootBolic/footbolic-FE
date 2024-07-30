import { BoardInterface } from "../board/BoardInterface";
import { CommentInterface } from "../comment/CommentInterface";
import { FileInterface } from "../file/FileInterface";
import { MemberInterface } from "../member/MemberInterface";
import { MenuInterface } from "../menu/MenuInterface";
import { PostRecommendationInterface } from "../recommendation/RecommendationInterface";

export interface PostInterface {
    id: string;
    boardId?: string;
    board?: BoardInterface;
    title?: string;
    content?: string;
    isSecret?: boolean;
    isAnnouncement?: boolean;
    isEditable?: boolean;
    isRecommended?: boolean;
    recommendationsSize?: number;
    recommendations?: PostRecommendationInterface[];
    announcementStartsAt?: number[];
    announcementEndsAt?: number[];
    comments?: CommentInterface[];
    menu?: MenuInterface;
    thumbnailFileId?: string;
    thumbnailFile?: FileInterface;
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