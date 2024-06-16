import { PostInterface } from "../../entity/post/PostInterface"

export type PostWriteProps = {
    post?: PostInterface;
    onSave?: (post: PostInterface) => any;
}