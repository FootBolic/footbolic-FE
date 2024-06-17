import { CommentInterface } from "../comment/CommentInterface";
import { MemberInterface } from "../member/MemberInterface";
import { PostInterface } from "../post/PostInterface";
import { ReplyInterface } from "../reply/ReplyInterface";

export interface RecommendationInterface {
    id: string;
    memberId?: string;
    member?: MemberInterface;
    createdAt?: number[];
    updatedAt?: number[];
}

export interface PostRecommendationInterface extends RecommendationInterface {
    postId?: string;
    post?: PostInterface
}

export interface CommentRecommendationInterface extends RecommendationInterface {
    commentId?: string;
    comment?: CommentInterface;
}

export interface ReplyRecommendationInterface extends RecommendationInterface {
    replyId?: string;
    reply?: ReplyInterface;
}