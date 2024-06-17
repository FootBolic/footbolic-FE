import { CommentInterface } from "../../entity/comment/CommentInterface"

export type CommentDetailsProps = {
    comment: CommentInterface;
    onSaveComment?: () => any;
    onCommentRecommendationChange?: (id: string, size: number, isRecommended: boolean) => any;
    onReplyRecommendationChange?: (id: string, size: number, isRecommended: boolean) => any;
}