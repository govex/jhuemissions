import { useAuth } from "react-oidc-context";
import { useParams, Navigate } from "react-router";
function Authentication() {
    let params = useParams();
    let auth = useAuth();
    console.log("auth", auth.isAuthenticated);

    if (params.code) {
        return <Navigate replace to={"/dashboard"} />
    }
    return <div>authenticating</div>
}

export default Authentication;