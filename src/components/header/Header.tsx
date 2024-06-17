import { Button, Layout, Popover } from "antd";
import styles from '../../styles/components/header/Header.module.scss';
import { UserOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootStateInterface } from "../../types/reducers/RootStateInterface";
import { setIsMobileMenuOpen } from "../../reducers/MenuReducer";
import { useState } from "react";
import SignInCard from "../sign/SignInCard";
import SignOutCard from "../sign/SignOutCard";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/common/RouteConstants";

const { Header: AntHeader } = Layout;

function Header () {

    const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);
    const { accessToken, nickname } = useSelector((state: RootStateInterface) => state.accessToken);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isUserInfoOpen, setIsUserInfoOpen] = useState<boolean>(false);

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
            <div className={styles.logo_container} onClick={() => navigate(ROUTES.MAIN_VIEW.path)}>
                FootBolic
            </div>
            <div className={styles.user_info_button_container}>
                <Popover
                    content={accessToken ? <SignOutCard /> : <SignInCard />}
                    title={accessToken ? `${nickname}님 반갑습니다.` : "로그인"}
                    trigger="click"
                    open={isUserInfoOpen}
                    onOpenChange={() => setIsUserInfoOpen(!isUserInfoOpen)}
                >
                    <Button
                        className={styles.user_info_button}
                        type="text"
                        icon={<UserOutlined />}
                    />
                </Popover>
            </div>
        </AntHeader>
    )
}

export default Header;