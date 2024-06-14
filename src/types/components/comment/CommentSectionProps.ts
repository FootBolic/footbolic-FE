import { CommentInterface } from "../../entity/comment/CommentInterface"

export type CommentSectionProps = {
    comments: CommentInterface[];
    onSaveComment?: () => any;
    onCommentRecommendationChange?: (id: string, size: number, isRecommended: boolean) => any;
    onReplyRecommendationChange?: (id: string, size: number, isRecommended: boolean) => any;
}