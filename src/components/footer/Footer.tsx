import { Layout } from 'antd';
import styles from '../../styles/components/footer/Footer.module.scss'

const { Footer: AntFooter } = Layout;

const Footer = () => {
    return (
        <AntFooter className={styles.footer}>FootBolic ©2023 Created by Koline-1</AntFooter>
    )
}

export default Footer;