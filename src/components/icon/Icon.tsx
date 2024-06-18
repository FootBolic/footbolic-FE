import AntIcon from "@ant-design/icons";
import { IconProps } from "../../types/components/icon/IconProps";

function Icon({ src, small }: IconProps) {

    return (
        <>
            <AntIcon 
                style={{ width: small ? '20px' : '50px' }}
                component={
                    () => (
                        <img 
                            style={{ width: small ? '20px' : '50px' }}
                            src={src}
                        />
                    )
                } 
            />
        </>
    )
}

export default Icon;