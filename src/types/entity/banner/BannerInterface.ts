import { MemberInterface } from "../member/MemberInterface";

export interface BannerInterface {
    id: string;
    title?: string;
    imagePath?: string;
    isMobile?: boolean;
    isTimeLimited?: boolean;
    startsAt?: number[] | string | Date;
    endsAt?: number[] | string | Date;
    isLinked?: boolean;
    linkAddress?: string;
    createMemberId?: string;
    createdAt?: number[];
    createdBy?: MemberInterface;
    updateMemberId?: string;
    updatedAt?: number[];
    updatedBy?: MemberInterface;
}

export interface BannerSearchInterface {
    title?: string;
    date?: string;
}