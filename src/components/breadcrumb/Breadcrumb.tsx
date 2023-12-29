import { Breadcrumb as AntBreadCrumb } from 'antd';
import styles from '../../styles/components/breadcrumb/Breadcrumb.module.scss'

function Breadcrumb () {
    return (
        <AntBreadCrumb 
            className={styles.breadcrumb} 
            items={[
                {
                    title: "Home"
                },
                {
                    title: "Bill"
                }
            ]}
        />
    )
}

export default Breadcrumb;