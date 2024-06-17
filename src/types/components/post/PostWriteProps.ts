import { PostInterface } from "../../entity/post/PostInterface"

export type PostWriteProps = {
    post?: PostInterface;
    isUpdate?: boolean;
    boardId?: string;
    onSave?: (post: PostInterface) => any;
}