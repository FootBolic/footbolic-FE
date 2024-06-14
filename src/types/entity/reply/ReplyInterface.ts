import { CommentInterface } from "../comment/CommentInterface";
import { MemberInterface } from "../member/MemberInterface";
import { ReplyRecommendationInterface } from "../recommendation/RecommendationInterface";

export interface ReplyInterface {
    id: string;
    commentId?: string;
    comment?: CommentInterface;
    content?: string;
    isEditable?: boolean;
    isRecommended?: boolean;
    recommendationsSize?: number;
    recommendations?: ReplyRecommendationInterface[];
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}