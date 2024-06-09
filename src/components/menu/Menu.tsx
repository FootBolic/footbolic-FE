import { Menu as AntMenu, Skeleton, message } from "antd";
import { UserOutlined, HomeOutlined } from '@ant-design/icons';
import type { MenuProps as AntMenuProps } from 'antd';
import { MenuProps } from "../../types/components/menu/MenuProps";
import { useQuery } from "react-query";
import { API_QUERY_KEYS, CODES } from "../../constants/common/DataConstants";
import { MenuAPI } from "../../api/menu/MenuAPI";
import { useState } from "react";
import { MenuInterface } from "../../types/entity/menu/MenuInterface";
import Error from "../error/Error";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsMobileMenuOpen } from "../../reducers/MenuReducer";
import { ROUTES } from "../../constants/common/RouteConstants";

type MenuItem = Required<AntMenuProps>['items'][number];

function Menu ({ theme }: MenuProps) {
  const dispatch = useDispatch();
  const location = useLocation();
  const [menus, setMenus] = useState<MenuInterface[]>([]);

  const { isFetching, isError } = useQuery({
    queryKey: [API_QUERY_KEYS.MENU.GET_MENUS_BY_AUTH],
    queryFn: () => MenuAPI.getMenusByAuth(),
    onSuccess: (result) => setMenus(result.menus),
    onError: (e: string) => message.error(e)
  })

  const homeMenu: MenuItem = {
    key: '/',
    icon: <HomeOutlined />,
    label: (
      <Link to={ROUTES.MAIN_VIEW.path} onClick={() => dispatch(setIsMobileMenuOpen({ isMobileMenuOpen: false }))}>
        메인페이지
      </Link>
    )
  }

  const toMenuItem = (menus: MenuInterface[]): MenuItem[] => {
    return [
      ...menus.map(menu => {
        let path = menu.program?.path || "";
        if (menu.program && menu.program.code === CODES.PROGRAM.BOARD) path += `/${menu.detailId}`;
        
        return {
          key: menu.program?.path || menu.id,
          icon: <UserOutlined />,
          children: menu.children?.length && toMenuItem(menu.children),
          label: menu.program?.path && !menu.children?.length ? (
            <Link to={path} onClick={() => dispatch(setIsMobileMenuOpen({ isMobileMenuOpen: false }))}>
              {menu.title}
            </Link>
          ) : menu.title,
        } as MenuItem;
      })
    ]
  }

  return <>
    { isFetching ? <Skeleton active /> : <>
      { isError ? <Error /> : <>
        <AntMenu theme={theme} mode="inline" selectedKeys={[location.pathname]} items={[homeMenu, ...toMenuItem(menus)]} />
      </>}
    </>}
  </>
}

export default Menu;