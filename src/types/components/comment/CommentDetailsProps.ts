import { CommentInterface } from "../../entity/comment/CommentInterface"

export type CommentDetailsProps = {
    comment: CommentInterface;
    onSaveComment?: () => any;
}