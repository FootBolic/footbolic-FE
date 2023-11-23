import { Layout } from "antd";
import styles from './Header.module.scss';

const { Header: AntHeader } = Layout;

const Header = () => {
    
    return (
        <AntHeader className={styles.header}>
            FootBolic
        </AntHeader>
    )
}

export default Header;