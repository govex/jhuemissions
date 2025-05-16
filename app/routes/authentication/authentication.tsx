import type { Route } from "../+types/authentication";
import { useAuth } from "react-oidc-context";

export async function action({ request }: Route.ClientActionArgs) {
  const auth = useAuth();
  auth.signinRedirect() 
  const sessionStatus = await auth.querySessionStatus();
  const formData = await request.formData();
  console.log(sessionStatus);
  console.log(formData);
  let formObj = Object.fromEntries(formData);
  return {"form": formObj, "session": sessionStatus}
}

function Authentication({actionData}:Route.ComponentProps) {
    console.log(actionData);
    return <div>authenticating</div>
}

export default Authentication;