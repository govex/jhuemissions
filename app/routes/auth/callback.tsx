import type { Route } from "./+types/callback";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "~/provider/useAuth";

function Callback({}:Route.ComponentProps) {
    const auth = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (auth.isAuthenticated || import.meta.env.DEV) {
            navigate("/dashboard", {replace: true, state: {authenticated: auth.isAuthenticated}});
        }
    }, [navigate])
    return <div>
            <div className="spinner-overlay">
                <div className="spinner"></div>        
            </div>
        </div>
}
export default Callback;