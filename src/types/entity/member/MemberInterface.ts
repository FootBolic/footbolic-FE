export interface MemberInterface {
    id: string;
    roleId?: string;
    // role?: Role;
    fullName?: string;
    nickname?: string;
    refreshToken?: string;
    // notifications?: [NotificationInterface];
    createdAt: number[];
    updatedAt: number[];
}