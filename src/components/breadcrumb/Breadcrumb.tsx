import { Breadcrumb as AntBreadCrumb } from 'antd';
import styles from '../../styles/components/breadcrumb/Breadcrumb.module.scss'
import { CODES } from '../../constants/common/DataConstants';
import { MenuInterface } from '../../types/entity/menu/MenuInterface';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import usePath from '../../hooks/usePath';

function Breadcrumb () {

    const { menu } = usePath();

    const homeMenu = {
        title: '메인페이지',
        href: '/'
    }

    const toMenuArray = (menu: MenuInterface): BreadcrumbItemType[] => {
        const result = [toItem(menu)];
        
        if (menu.parent) {
            let target = menu.parent;
            while (true) {
                result.push(toItem(target));
                if (target.parent) target = target.parent;
                else break;
            }
        }

        result.reverse();
        return result;
    }

    const toItem = (menu: MenuInterface): BreadcrumbItemType => {
        const item: BreadcrumbItemType = { title: menu.title };

        if (menu.program?.path && menu.program.path === location.pathname && !menu.children?.length) {
            item.href = getPath(menu);
        }

        return item;
    }

    const getPath = (menu: MenuInterface) => {
        let path = menu.program?.path || "";
        if (menu.program && menu.program.code === CODES.PROGRAM.BOARD) path += `/${menu.detailId}`;
        path += `?menuId=${menu.id}`;

        return path;
    }

    return (
        <AntBreadCrumb 
            className={styles.breadcrumb} 
            items={menu ? [homeMenu, ...toMenuArray(menu)] : [homeMenu]}
        />
    )
}

export default Breadcrumb;