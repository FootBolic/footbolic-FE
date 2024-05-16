import MainView from "../../routes/main/MainView";
import MenuManagement from "../../routes/management/menu/MenuManagement";
import MemberCreate from "../../routes/member/MemberCreate";
import MemberInfo from "../../routes/member/MemberInfo";
import KakaoAuth from "../../routes/oauth/KakaoAuth";
import NaverAuth from "../../routes/oauth/NaverAuth";

export const ROUTES = {
    // 메인페이지
    MAIN_VIEW: {
        path: '/',
        element: MainView
    },
    // 메뉴관리 목록
    MENU_MANAGEMENT: {
        path: '/menu/management',
        element: MenuManagement
    },
    // 카카오 API 회원가입 및 로그인
    KAKAO_AUTH: {
        path: '/oauth/kakao',
        element: KakaoAuth
    },
    // 네이버 API 회원가입 및 로그인
    NAVER_AUTH: {
        path: '/oauth/naver',
        element: NaverAuth
    },
    // 회원가입 - 회원 정보 입력
    MEMBER_CREATE: {
        path: '/member/create',
        element: MemberCreate
    },
    // 회원 마이페이지
    MEMBER_INFO: {
        path: '/member/me',
        element: MemberInfo
    }
}