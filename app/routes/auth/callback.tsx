import type { Route } from "./+types/callback";
import { Navigate } from "react-router";
import {useState} from "react";
import { useAuth } from "~/provider/useAuth";

function Callback({}:Route.ComponentProps) {
    const auth = useAuth();
    console.log(auth);
    const [safe, setSafe] = useState(auth.isAuthenticated)
    if (safe) {
        return <Navigate replace to={"/dashboard"} />
    }
    return <div>
            <div className="spinner-overlay">
                <div className="spinner"></div>        
            </div>
        </div>
}
export default Callback;