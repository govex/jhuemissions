import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router";
function Authentication() {
    let location = useLocation();
    let [authenticated, setAuthenticated] = useState(false);
    useEffect(()=>{
        const params = new URLSearchParams(location.search);
        if (params.get('code')) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    },[location])
    if (authenticated) {
        return <Navigate replace to={"/dashboard"} />
    }
    return <div className="spinner-overlay">
            <div className="spinner"></div>
        </div>
}

export default Authentication;