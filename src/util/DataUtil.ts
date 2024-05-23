import { AUTH_PLATFORM, AUTH_PLATFORM_KR } from "../constants/common/DataConstants";

/**
 * 대상 배열의 각 객체에 'key' 값을 추가한다.
 * @param {any[]} obj 'key'값을 추가할 대상 object[]
 * @returns 'key'값이 추가된 object[]
 */
export const addKey = (obj: any[]): object[] => {
    obj.forEach((e) => e.key = e.id)
    return obj;
}

/**
 * 플랫폼명을 한국어로 변환한다
 * @param {string} platform 플랫폼명 영문
 * @returns 변환된 한국어 플랫폼
 */
export const translatePlatform = (platform: string): string => {
    return platform === AUTH_PLATFORM.KAKAO ? AUTH_PLATFORM_KR.KAKAO : (platform === AUTH_PLATFORM.NAVER ? AUTH_PLATFORM_KR.NAVER : "");
}