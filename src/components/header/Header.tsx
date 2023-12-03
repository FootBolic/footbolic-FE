import { Button, Layout } from "antd";
import styles from '../../styles/components/header/Header.module.scss';
import { UserOutlined } from "@ant-design/icons";
import useDocumentSize from "../../hooks/useDocumentSize";
import { MOBILE_SIZE } from "../constants/ViewConstants";
import { HeaderProps } from "../../types/components/header/HeaderProps";

const { Header: AntHeader } = Layout;

function Header ({ collapsed }: HeaderProps) {

    const { width: windowWidth } = useDocumentSize();

    const LOGO_CLASSNAME = windowWidth < MOBILE_SIZE ? '' : (!collapsed ? styles.logo_container_open : styles.logo_container_close)

    return (
        <AntHeader className={styles.header}>
            <div className={`${styles.logo_container} ${LOGO_CLASSNAME}`}>
                FootBolic
            </div>
            <div className={styles.user_info_button_container}>
                <Button
                    type="text"
                    className={styles.user_info_button}
                    icon={<UserOutlined />}
                />
            </div>
        </AntHeader>
    )
}

export default Header;