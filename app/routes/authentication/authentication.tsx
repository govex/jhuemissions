import { useAuth } from "react-oidc-context";
import { useLocation, Navigate } from "react-router";
function Authentication() {
    let location = useLocation();
    let auth = useAuth();
    console.log("auth", auth.isAuthenticated);
    console.log(location);
    // if (params.code) {
    //     return <Navigate replace to={"/dashboard"} />
    // }
    return <div>authenticating</div>
}

export default Authentication;