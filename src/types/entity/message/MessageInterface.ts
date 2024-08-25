export interface MessageInterface {
    sentFrom?: string;
    sentAt?: string;
    sentTime?: string;
    payload?: string;
    isOwn?: boolean;
    isNotice?: boolean;
}