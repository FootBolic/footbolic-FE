import { UserOutlined } from "@ant-design/icons";
import { ICON_DIRECTORY_PREFIX, ICON_FONT_SIZE } from "../constants/components/IconConstants";
import Icon from "../components/icon/Icon";

function useIcon() {
    const getIcon = (code: string, type: string, isSmall: boolean) => {
        switch(code) {
            case "ICON_USER":
                return <UserOutlined style={{ fontSize: isSmall ? ICON_FONT_SIZE.ANT_BASIC.SMALL : ICON_FONT_SIZE.ANT_BASIC.DEFAULT }} />
            default:
                return <Icon src={`${ICON_DIRECTORY_PREFIX}${code}.${type}`} />
        }
    }

    return { getIcon }
}

export default useIcon;