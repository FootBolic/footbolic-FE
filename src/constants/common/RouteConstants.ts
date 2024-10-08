import Board from "../../routes/board/Board";
import MainView from "../../routes/main/MainView";
import AuthorizationManagement from "../../routes/management/authorization/AuthorizationManagement";
import BannerManagement from "../../routes/management/banner/BannerManagement";
import BoardManagement from "../../routes/management/board/BoardManagement";
import IconManagement from "../../routes/management/icon/IconManagement";
import MemberManagement from "../../routes/management/member/MemberManagement";
import MenuManagement from "../../routes/management/menu/MenuManagement";
import ProgramManagement from "../../routes/management/program/ProgramManagement";
import RoleManagement from "../../routes/management/role/RoleManagement";
import MemberCreate from "../../routes/member/MemberCreate";
import MemberInfo from "../../routes/member/MemberInfo";
import MemberWithdraw from "../../routes/member/MemberWithdraw";
import KakaoAuth from "../../routes/oauth/KakaoAuth";
import NaverAuth from "../../routes/oauth/NaverAuth";
import PostEdit from "../../routes/post/PostEdit";
import PostRead from "../../routes/post/PostRead";
import PostWrite from "../../routes/post/PostWrite";

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
    // 배너 관리 페이지
    BANNER_MANAGEMENT: {
        path: '/management/banner',
        element: BannerManagement
    },
    // 게시판 관리 페이지
    BOARD_MANAGEMENT: {
        path: '/management/board',
        element: BoardManagement
    },
    // 아이콘 관리 페이지
    ICON_MANAGEMENT: {
        path: '/management/icon',
        element: IconManagement
    },
    // 게시판 페이지
    BOARD: {
        path: '/board/:boardId',
        element: Board
    },
    // 게시글 읽기 페이지
    POST_READ: {
        path: '/post/:postId',
        element: PostRead
    },
    // 게시글 작성 페이지
    POST_EDIT: {
        path: '/post/:postId/edit',
        element: PostEdit
    },
    // 게시글 작성 페이지
    POST_WRITE: {
        path: '/:boardId/post/write',
        element: PostWrite
    },
}