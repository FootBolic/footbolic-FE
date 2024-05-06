import MainView from "../../routes/main/MainView";
import MenuManagementList from "../../routes/management/menu/MenuManagementList";
import MemberCreate from "../../routes/member/MemberCreate";
import KakaoAuth from "../../routes/oauth/KakaoAuth";
import NaverAuth from "../../routes/oauth/NaverAuth";


export const ROUTES = {
    // 메인페이지
    MAIN_VIEW: {
        path: '/',
        element: MainView
    },
    // 메뉴관리 목록
    MENU_MANAGEMENT_LIST: {
        path: '/management/menu/list',
        element: MenuManagementList
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
    }
}