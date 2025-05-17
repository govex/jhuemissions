import type { Route } from "./+types/callback";
import { useNavigate } from "react-router";
import { useAuth } from "~/provider/useAuth";

function Callback({}:Route.ComponentProps) {
    const auth = useAuth();
    const navigate = useNavigate();
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