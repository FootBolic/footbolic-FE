import MainView from "../../routes/main/MainView";
import MenuManagementList from "../../routes/management/menu/MenuManagementList";


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
    }
}