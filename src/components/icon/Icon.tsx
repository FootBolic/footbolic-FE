import AntIcon from "@ant-design/icons";
import { IconProps } from "../../types/components/icon/IconProps";
import { ICON_FONT_SIZE } from "../../constants/components/IconConstants";

function Icon({ src, small }: IconProps) {

    return (
        <>
            <AntIcon 
                style={{ width: small ? ICON_FONT_SIZE.ANT_BASIC.SMALL : ICON_FONT_SIZE.ANT_BASIC.DEFAULT }}
                component={
                    () => (
                        <img 
                            style={{ width: small ? ICON_FONT_SIZE.ANT_BASIC.SMALL : ICON_FONT_SIZE.ANT_BASIC.DEFAULT }}
                            src={src}
                        />
                    )
                } 
            />
        </>
    )
}

export default Icon;