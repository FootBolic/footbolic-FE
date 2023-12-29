import { Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootStateInterface } from "../../types/reducers/RootStateInterface";
import { setIsMobileMenuOpen } from "../../reducers/MobileMenuReducer";
import { MOBILE_MENU_DRAWER_WIDTH, MOBILE_MENU_DRAWER_PLACEMENT } from "../../constants/components/DrawerConstants";
import { CloseOutlined } from "@ant-design/icons";
import Menu from "../menu/Menu";
import styles from "../../styles/components/drawer/MobileMenuDrawer.module.scss"


function MobilMenuDrawer () {

    const dispatch = useDispatch();

    const isMobileMenuOpen = useSelector((state: RootStateInterface) => state.mobileMenu.isMobileMenuOpen);

    const onClose = () => {
        dispatch(setIsMobileMenuOpen({ isMobileMenuOpen: false }))
    }

    return (
        <Drawer
          title="Menu"
          width={MOBILE_MENU_DRAWER_WIDTH}
          placement={MOBILE_MENU_DRAWER_PLACEMENT}
          onClose={onClose}
          closable={false}
          open={isMobileMenuOpen}
          key={MOBILE_MENU_DRAWER_PLACEMENT}
          styles={{ body: { padding: '0' } }}
          extra={<>
            <CloseOutlined className={styles.close_button} onClick={onClose} />
          </>}
        >
            <Menu theme='light' />
        </Drawer>
    )
}

export default MobilMenuDrawer;