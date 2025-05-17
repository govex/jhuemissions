import type { Route } from "./+types/callback";
import { Navigate } from "react-router";
import {useState, useEffect, useContext} from "react";
import { User } from "oidc-client-ts";
import { AuthContext } from "~/provider/AuthContext";

function getUser(authority:string, client_id:string) {
    if (typeof window !== undefined) {
        const oidcStorage = window.localStorage.getItem(`oidc.user:${authority}:${client_id}`)
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
    const auth = useContext(AuthContext);
   useEffect(() => {
        if (auth) {
            setUser(getUser(auth.settings.authority, auth.settings.client_id))
        }
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