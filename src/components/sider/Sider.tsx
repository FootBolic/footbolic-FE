import { Layout } from "antd";
import Menu from "../menu/Menu";
import useDocumentSize from "../../hooks/useDocumentSize";
import { MOBILE_SIZE } from "../../constants/common/ViewConstants";
import styles from '../../styles/components/sider/Sider.module.scss'

const { Sider: AntSider } = Layout;

function Sider () {

    const { width: windowWidth } = useDocumentSize();
    
    return (
        <>
            {windowWidth && windowWidth < MOBILE_SIZE ? <>
            </> : <>
                <AntSider className={styles.sider} style={{ position: 'sticky' }}>
                    <Menu theme="dark" />
                </AntSider>
            </>}
        </>
    )
}

export default Sider;