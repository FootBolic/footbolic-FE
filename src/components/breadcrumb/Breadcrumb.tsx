import { Breadcrumb as AntBreadCrumb } from 'antd';
import styles from './Breadcrumb.module.scss'

const Breadcrumb = () => {
    return (
        <AntBreadCrumb className={styles.breadcrumb}>
            <AntBreadCrumb.Item>User</AntBreadCrumb.Item>
            <AntBreadCrumb.Item>Bill</AntBreadCrumb.Item>
        </AntBreadCrumb>
    )
}

export default Breadcrumb;