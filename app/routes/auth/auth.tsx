import { withAuthenticationRequired } from "~/provider/withAuthenticationRequired";
function Auth() {
    return <div>
            <div className="spinner-overlay">
                <div className="spinner"></div>        
            </div>
        </div>
}
export default withAuthenticationRequired(Auth);
