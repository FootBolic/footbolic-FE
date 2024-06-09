import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MenuInterface } from "../types/entity/menu/MenuInterface";
import { useQuery } from "react-query";
import { API_QUERY_KEYS } from "../constants/common/DataConstants";
import { MenuAPI } from "../api/menu/MenuAPI";
import excludedPaths from "../json/ExcludedPaths.json";

function usePath() {


    const location = useLocation();

    const [menu, setMenu] = useState<MenuInterface>();
    const [enabled, setEnabled] = useState<boolean>(false);

    const { refetch } = useQuery({
        queryKey: [API_QUERY_KEYS.MENU.GET_MENU_PATH],
        queryFn: () => MenuAPI.getMenuPath(location.pathname),
        enabled: enabled,
        onSuccess: (result) => setMenu(result.menu),
        onError: () => setMenu(undefined)
    })

    useEffect(() => {
        if (location.pathname && !excludedPaths.includes(location.pathname)) {
            setEnabled(true);
            refetch();
        } else {
            setEnabled(false);
            setMenu(undefined);
        }
    }, [location])

    return { menu }

}

export default usePath;