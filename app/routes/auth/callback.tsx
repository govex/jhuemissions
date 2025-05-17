import type { Route } from "./+types/callback";
import { Navigate, useLocation } from "react-router";
import {useState, useEffect} from "react";
import { User } from "oidc-client-ts";
import { useAuth } from "~/provider/useAuth";

export function getUser() {
    if (typeof window !== undefined) {
        const auth = useAuth();
        const oidcStorage = window.localStorage.getItem(`oidc.user:${auth.settings.authority}:${auth.settings.client_id}`)
        if (!oidcStorage) {
            return null;
        }
        return User.fromStorageString(oidcStorage);
    } else {
        return null;
    }
}

function Callback({}:Route.ComponentProps) {
    const [user, setUser] = useState<any>(undefined)
    useEffect(() => {
        setUser(getUser())
    }, [])
    console.log("callback getUser", user)
    if (user) {
        return <Navigate replace to={"/dashboard"} />
    }
    return <div>
            <div className="spinner-overlay">
                <div className="spinner"></div>        
            </div>
        </div>
}
export default Callback;