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

/**
 * 디폴트 게시판 페이지 별 결과 수
 */
export const BOARD_PAGE_SIZE = 20;

export const UPLOAD_ALLOWED_EXTENSIONS = ['image/png', 'image/jpeg'];

/**
 * 코드명
 */
export const CODES = {
    PROGRAM: {
        BOARD: "PROGRAM_BOARD",
    }
}

/**
 * React Query의 queryKey
 */
export const API_QUERY_KEYS = {
    AUTHORIZATION: {
        GET_AUTHORIZATIONS: 'GET_AUTHORIZATIONS',
        GET_ALL_AUTHORIZATIONS: 'GET_ALL_AUTHORIZATIONS',
        GET_AUTHORIZATION: 'GET_AUTHORIZATION',
    },
    BANNER: {
        GET_PUBLIC_BANNERS: 'GET_PUBLIC_BANNERS',
    },
    BOARD: {
        GET_BOARDS: 'GET_BOARDS',
        GET_BOARD: 'GET_BOARD',
        GET_ALL_BOARDS: 'GET_ALL_BOARDS',
        GET_MAIN_BOARDS: 'GET_MAIN_BOARDS',
    },
    ICON: {
        GET_ALL_ICONS: 'GET_ALL_ICONS',
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
        GET_MENU_PATH: 'GET_MENU_PATH',
        GET_MENUS_BY_AUTH: 'GET_MENUS_BY_AUTH'
    },
    PROGRAM: {
        GET_PROGRAMS: 'GET_PROGRAMS',
        GET_ALL_PROGRAMS: 'GET_ALL_PROGRAMS',
        GET_PROGRAM: 'GET_PROGRAM'
    },
    POST: {
        GET_POSTS: 'GET_POSTS',
        GET_POST: 'GET_POST',
        GET_HOT_POSTS: 'GET_HOT_POSTS',
        GET_NEW_POSTS: 'GET_NEW_POSTS',
        GET_NEW_POSTS_BY_BOARD: 'GET_NEW_POSTS_BY_BOARD',
    },
    ROLE: {
        GET_ROLES: 'GET_ROLES',
        GET_ALL_ROLES: 'GET_ALL_ROLES',
        GET_ROLE: 'GET_ROLE',
    },
    RECOMMENDATION: {
        GET_RECOMMENDATIONS: 'GET_RECOMMENDATIONS' 
    }
}