export type CommentWriteProps = {
    commentId?: string;
    replyId?: string;
    isReply?: boolean;
    isUpdate?: boolean;
    content?: string;
    hidden?: boolean;
    onSaveComment?: () => any;
}