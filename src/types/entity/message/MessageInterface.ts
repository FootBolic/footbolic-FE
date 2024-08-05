export interface MessageInterface {
    sentFrom?: string;
    sentAt?: string;
    payload?: string;
    isOwn?: boolean;
    isNotice?: boolean;
}