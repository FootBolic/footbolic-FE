import { useLocation } from "react-router-dom";

function useURLParam () {

    const location = useLocation();
    
    return Object.fromEntries(new URLSearchParams(location.search));
}

export default useURLParam;