export interface MemberInterface {
    id: string;
    roleId?: string;
    // role?: Role;
    nickname?: string;
    idAtProvider?: string;
    platform?: string;
    refreshToken?: string;
    refreshTokenExpiresAt?: number[] | Date | string;
    accessToken?: string;
    accessTokenExpiresAt?: number[] | Date | string;
    idToken?: string;
    scope?: string;
    tokenType?: string;
    // notifications?: [NotificationInterface];
    createdAt?: number[];
    updatedAt?: number[];
}