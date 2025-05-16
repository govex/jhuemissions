import { useAuth } from "react-oidc-context";
import { useParams, Navigate, useRouteLoaderData } from "react-router";
function Authentication() {
    let params = useParams();
    let auth = useAuth();
    let rootData = useRouteLoaderData("root");
    console.log("auth", auth.isAuthenticated);
    console.log("root", rootData.authenticated);

    if (params.code) {
        return <Navigate replace to={"/dashboard"} />
    }
    return <div>authenticating</div>
}

export default Authentication;