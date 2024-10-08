import { MemberInterface } from "../member/MemberInterface";
import { MenuInterface } from "../menu/MenuInterface";
import { PostInterface } from "../post/PostInterface";

export interface BoardInterface {
    id: string;
    title?: string;
    isSecretable?: boolean;
    isRecommendable?: boolean;
    isCommentable?: boolean;
    isAnnounceable?: boolean;
    isUsed?: boolean;
    posts?: PostInterface[];
    menu?: MenuInterface;
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}

export interface BoardSearchInterface {
    title?: string;
}