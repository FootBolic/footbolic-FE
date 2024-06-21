import { FileInterface } from "../file/FileInterface";
import { MemberInterface } from "../member/MemberInterface";

export interface BannerInterface {
    id: string;
    title?: string;
    fileId?: string;
    file?: FileInterface;
    link?: string;
    isMobile?: boolean;
    isTimeLimited?: boolean;
    startsAt?: number[] | string | Date;
    endsAt?: number[] | string | Date;
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