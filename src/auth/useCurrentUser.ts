import { useState, useEffect } from "react";
import { useFusionContext } from "../core/FusionContext";
import AuthUser from "./AuthUser";

export default (): AuthUser | null => {
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const fusionContext = useFusionContext();

    useEffect(() => {
        fusionContext.auth.container.getCachedUserAsync().then(setCurrentUser);
    }, []);

    return currentUser;
};
