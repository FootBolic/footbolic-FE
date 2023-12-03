import { Button, Layout } from "antd";
import Menu from "../menu/Menu";
import useDocumentSize from "../../hooks/useDocumentSize";
import { MOBILE_SIZE } from "../constants/ViewConstants";
import styles from "../../styles/components/sider/Sider.module.scss";
import { MenuUnfoldOutlined, CloseOutlined } from "@ant-design/icons";
import { SiderProps } from "../../types/components/sider/SiderProps";

const { Sider: AntSider } = Layout;

function Sider ({collapsed, setCollapsed}: SiderProps) {

    const { width: windowWidth } = useDocumentSize();
    
    return (
        <>
            {windowWidth && windowWidth < MOBILE_SIZE ? <>
                <div className={styles.sider_mobile_container}>
                    <AntSider 
                        className={styles.sider_mobile}
                        breakpoint="sm"
                        collapsedWidth={0}
                        collapsible
                        collapsed={collapsed}
                        trigger={null}
                    >
                        <Menu />
                    </AntSider>
                </div>
                <div className={styles.collapse_button_container}>
                    <Button
                        type="text"
                        className={`${styles.collapse_button} ${collapsed ? styles.collapse_button_out : styles.collapse_button_in}`}
                        icon={collapsed ? <MenuUnfoldOutlined /> : <CloseOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                </div>
            </> : <>
                <AntSider
                    className={styles.sider_desktop}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <Menu />
                </AntSider>
            </>}
        </>
    )
}

export default Sider;