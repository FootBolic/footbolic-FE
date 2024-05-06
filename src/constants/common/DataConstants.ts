/**
 * mutation 타입 파라미터 전달용
 */
export const MUTATION_TYPES = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE'
}

/**
 * 카카오 인증 에러 텍스트
 */
export const KAKAO_AUTH_ERROR_DESCRIPTIONS = {
    CANCELLATION: 'User denied access'
}

/**
 * 인증 API 플랫폼
 */
export const AUTH_PLATFORM = {
    KAKAO: 'KAKAO',
    NAVER: 'NAVER'
}

/**
 * Dayjs 전달용 datetime 형식
 */
export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const API_QUERY_KEYS = {
    MENU: {
        GET_MENUS: 'GET_MENUS'
    },
    MEMBER: {
        GET_MEMBER_BY_ID_AT_PLATFORM: 'GET_MEMBER_BY_ID_AT_PLATFORM'
    }
}