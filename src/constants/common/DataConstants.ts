/**
 * 인증 API 플랫폼
 */
export const AUTH_PLATFORM = {
    KAKAO: 'kakao',
    NAVER: 'naver'
}

/**
 * 인증 API 플랫폼 한국어
 */
export const AUTH_PLATFORM_KR = {
    KAKAO: '카카오',
    NAVER: '네이버'
}

/**
 * Dayjs 전달용 datetime 형식
 */
export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

/**
 * Access Token 만료 전 갱신할 시간
 */
export const TOKEN_RENEWAL_TIME = {
    CHECK_PERIOD: 30 * 1000,
    FETCH_REM_TIME: 20 * 1000
}

export const BOARD_PAGE_SIZE = 20;

/**
 * React Query의 queryKey
 */
export const API_QUERY_KEYS = {
    AUTHORIZATION: {
        GET_AUTHORIZATIONS: 'GET_AUTHORIZATIONS',
        GET_ALL_AUTHORIZATIONS: 'GET_ALL_AUTHORIZATIONS',
        GET_AUTHORIZATION: 'GET_AUTHORIZATION',
    },
    MEMBER: {
        GET_MEMBERS: 'GET_MEMBERS',
        GET_MEMBER: 'GET_MEMBER',
        GET_TOKEN_MEMBER: 'GET_TOKEN_MEMBER',
        GET_MEMBER_BY_ID_AT_PLATFORM: 'GET_MEMBER_BY_ID_AT_PLATFORM'
    },
    MENU: {
        GET_MENUS: 'GET_MENUS',
        GET_MENU: 'GET_MENU',
        GET_MENU_BY_ID: 'GET_MENU_BY_ID',
        GET_MENUS_BY_AUTH: 'GET_MENUS_BY_AUTH'
    },
    PROGRAM: {
        GET_PROGRAMS: 'GET_PROGRAMS',
        GET_ALL_PROGRAMS: 'GET_ALL_PROGRAMS',
        GET_PROGRAM: 'GET_PROGRAM'
    },
    ROLE: {
        GET_ROLES: 'GET_ROLES',
        GET_ALL_ROLES: 'GET_ALL_ROLES',
        GET_ROLE: 'GET_ROLE',
    },
}