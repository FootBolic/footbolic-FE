import { useEffect, useState } from "react";
import { MenuInterface } from "../types/entity/menu/MenuInterface";
import { useQuery } from "react-query";
import { API_QUERY_KEYS } from "../constants/common/DataConstants";
import { MenuAPI } from "../api/menu/MenuAPI";
import useURLParam from "./useURLParam";

function usePath() {
    const { menuId } = useURLParam();

    const [menu, setMenu] = useState<MenuInterface>();
    const [enabled, setEnabled] = useState<boolean>(false);

    const { refetch } = useQuery({
        queryKey: [API_QUERY_KEYS.MENU.GET_MENU_PATH],
        queryFn: () => MenuAPI.getMenuPath(menuId),
        enabled: enabled,
        onSuccess: (result) => setMenu(result.menu),
        onError: () => setMenu(undefined)
    })

    useEffect(() => {
        if (menuId) {
            setEnabled(true);
            refetch();
        } else {
            setEnabled(false);
            setMenu(undefined);
        }
    }, [menuId])

    return { menu }

}

export default usePath;