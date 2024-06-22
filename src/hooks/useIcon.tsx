import {
    AppstoreOutlined,
    AuditOutlined,
    BookOutlined,
    CheckOutlined,
    FlagOutlined,
    HomeOutlined,
    MenuOutlined,
    OrderedListOutlined,
    PieChartOutlined,
    SettingOutlined,
    TrophyOutlined,
    UserOutlined
} from "@ant-design/icons";
import { ICON_DIRECTORY_PREFIX, ICON_FONT_SIZE } from "../constants/components/IconConstants";
import Icon from "../components/icon/Icon";

function useIcon() {
    const getIcon = (code: string | undefined, type: string | undefined, isSmall: boolean) => {
        if (!code) return;
        const style = { fontSize: isSmall ? ICON_FONT_SIZE.ANT_BASIC.SMALL : ICON_FONT_SIZE.ANT_BASIC.DEFAULT };
        switch(code) {
            case "ICON_APPSTORE":
                return <AppstoreOutlined style={style} />
            case "ICON_AUDIT":
                return <AuditOutlined style={style} />
            case "ICON_BOOK":
                return <BookOutlined style={style} />
            case "ICON_CHECK":
                return <CheckOutlined style={style} />
            case "ICON_FLAG":
                return <FlagOutlined style={style} />
            case "ICON_HOME":
                return <HomeOutlined style={style} />
            case "ICON_MENU":
                return <MenuOutlined  style={style} />
            case "ICON_ORDERED_LIST":
                return <OrderedListOutlined style={style} />
            case "ICON_PIE_CHART":
                return <PieChartOutlined style={style} />
            case "ICON_SETTING":
                return <SettingOutlined style={style} />
            case "ICON_TROPHY":
                return <TrophyOutlined style={style} />
            case "ICON_USER":
                return <UserOutlined style={style} />
            default:
                return !type ? null : <Icon small={isSmall} src={`${ICON_DIRECTORY_PREFIX}${code}.${type}`} />
        }
    }

    return { getIcon }
}

export default useIcon;