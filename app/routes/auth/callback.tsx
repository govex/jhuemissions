import type { Route } from "./+types/callback";
import { useNavigate } from "react-router";
import {useState} from "react";
import { useAuth } from "~/provider/useAuth";

function Callback({}:Route.ComponentProps) {
    const auth = useAuth();
    const navigate = useNavigate();
    console.log(auth.isAuthenticated);
    if (auth.isAuthenticated) {
        navigate("/dashboard");
    }
    return <div>
            <div className="spinner-overlay">
                <div className="spinner"></div>        
            </div>
        </div>
}
export default Callback;