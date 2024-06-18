import { UserOutlined } from "@ant-design/icons";
import { ICON_FONT_SIZE } from "../constants/components/IconConstants";
import Icon from "../components/icon/Icon";
import premier_league from "../assets/premier_league.svg";

function useIcon() {
    const getIcon = (code: string, isSmall: boolean) => {
        switch(code) {
            case "ICON_USER":
                return <UserOutlined style={{ fontSize: isSmall ? ICON_FONT_SIZE.ANT_BASIC.SMALL : ICON_FONT_SIZE.ANT_BASIC.DEFAULT }} />
            case "ICON_PREMIER_LEAGUE":
                return <Icon src={premier_league} />
            default:
                return null;
        }
    }

    return { getIcon }
}

export default useIcon;