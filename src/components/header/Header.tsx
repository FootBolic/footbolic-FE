import { Button, Layout } from "antd";
import styles from '../../styles/components/header/Header.module.scss';
import { UserOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootStateInterface } from "../../types/reducers/RootStateInterface";
import { setIsMobileMenuOpen } from "../../reducers/MobileMenuReducer";

const { Header: AntHeader } = Layout;

function Header () {

    const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);
    const dispatch = useDispatch();

    const onMobilMenuButtonClick = () => {
        dispatch(setIsMobileMenuOpen({ isMobileMenuOpen: true }))
    }

    return (
        <AntHeader className={`${styles.header_desktop} ${isMobile ? styles.fixed : ''}`}>
            {isMobile && <>
                <div className={styles.mobile_menu_button_container}>
                    <Button
                        className={styles.mobile_menu_button}
                        type="text"
                        icon={<MenuUnfoldOutlined />}
                        onClick={onMobilMenuButtonClick}
                    />
                </div>
            </>}
            <div className={styles.logo_container}>
                FootBolic
            </div>
            <div className={styles.user_info_button_container}>
                <Button
                    className={styles.user_info_button}
                    type="text"
                    icon={<UserOutlined />}
                />
            </div>
        </AntHeader>
    )
}

export default Header;