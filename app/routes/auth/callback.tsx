import type { Route } from "./+types/callback";
import { Navigate } from "react-router";
import { getUser } from "~/provider/utils";

function Callback({}:Route.ComponentProps) {
    const user = getUser();
    console.log("callback getUser", user)
    if (!!user) {
        return <Navigate replace to={"/dashboard"} />
    }
    return <div>
            <div className="spinner-overlay">
                <div className="spinner"></div>        
            </div>
        </div>
}
export default Callback;