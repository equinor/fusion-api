import { useState, useEffect } from "react";
import { useFusionContext } from "../core/FusionContext";
import AuthUser from "./AuthUser";

export default (): AuthUser | null => {
    const fusionContext = useFusionContext();
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(fusionContext.auth.container.getCachedUser());

    useEffect(() => {
        fusionContext.auth.container.getCachedUserAsync().then(setCurrentUser);
    }, []);

    return currentUser;
};
