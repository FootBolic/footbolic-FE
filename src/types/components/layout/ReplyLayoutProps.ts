import { ReplyInterface } from "../../entity/reply/ReplyInterface"

export type ReplyLayoutProps = {
    reply: ReplyInterface;
    onSaveReply?: () => any;
}