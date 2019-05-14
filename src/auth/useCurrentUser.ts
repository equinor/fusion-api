import { useFusionContext } from "../core/FusionContext";
import AuthUser from "./AuthUser";

export default (): AuthUser | null => {
    const fusionContext = useFusionContext();
    return fusionContext.auth.container.getCachedUser();
};