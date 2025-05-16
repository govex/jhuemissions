import type { Route } from "./+types/callback";
import { getUser } from "~/provider/utils";

export function action({request, params, context}:Route.ActionArgs) {
    console.log("callback action", request);
    const body = request.body;
    return {body:body, params:params, context:context};
}
export function clientAction({request, params, context}:Route.ClientActionArgs) {
    console.log("callback clientAction", request);
    const body = request.body;
    return {body:body, params:params, context:context};
}
function Callback({actionData}:Route.ComponentProps) {
    console.log("callback actiondata", actionData);
    let user = getUser();
    console.log("callback getUser", user)
    return <div>
            <div className="spinner-overlay">
                <div className="spinner"></div>        
            </div>
        </div>
}
export default Callback;