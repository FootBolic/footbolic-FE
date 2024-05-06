export interface KakaoTokenInterface {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token: string;
    refresh_token_expires_in: number;
    scope: string;
    token_type: string;
}

export interface KakaoUserInfoInterface {
    id: number;
    connected_at: string;
}