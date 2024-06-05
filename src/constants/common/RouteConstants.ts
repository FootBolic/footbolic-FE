import MainView from "../../routes/main/MainView";
import AuthorizationManagement from "../../routes/management/authorization/AuthorizationManagement";
import BoardManagement from "../../routes/management/board/BoardManagement";
import MemberManagement from "../../routes/management/member/MemberManagement";
import MenuManagement from "../../routes/management/menu/MenuManagement";
import ProgramManagement from "../../routes/management/program/ProgramManagement";
import RoleManagement from "../../routes/management/role/RoleManagement";
import MemberCreate from "../../routes/member/MemberCreate";
import MemberInfo from "../../routes/member/MemberInfo";
import MemberWithdraw from "../../routes/member/MemberWithdraw";
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
        path: '/management/menu',
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
    },
    // 회원 탈퇴 페이지
    MEMBER_WITHDRAW: {
        path: '/member/withdraw/:platform',
        element: MemberWithdraw
    },
    // 회원 관리 페이지
    MEMBER_MANAGEMENT: {
        path: '/management/member',
        element: MemberManagement
    },
    // 권한 관리 페이지
    AUTHORIZATION_MANAGEMENT: {
        path: '/management/authorization',
        element: AuthorizationManagement
    },
    // 역할 관리 페이지
    ROLE_MANAGEMENT: {
        path: '/management/role',
        element: RoleManagement
    },
    // 프로그램 관리 페이지
    PROGRAM_MANAGEMENT: {
        path: '/management/program',
        element: ProgramManagement
    },
    // 게시판 관리 페이지
    BOARD_MANAGEMENT: {
        path: '/management/board',
        element: BoardManagement
    }
}