import { CommentInterface } from "../../entity/comment/CommentInterface"

export type CommentSectionProps = {
    comments: CommentInterface[];
    onSaveComment?: () => any;
}