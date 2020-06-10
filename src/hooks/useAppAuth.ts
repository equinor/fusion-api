import React from 'react';

import { AppAuth } from "../http/apiClients/models/fusion/apps/AppManifest";
import { useFusionContext } from '../core/FusionContext';

/**
 * Note: will return true when appAuths is undefined
 * 
 * @example
 * const { app: { container: appContainer } } = useFusionContext();
 * const [app, setApp] = React.useState<AppManifest | null>(null);
 * React.useEffect(() => appContainer.on('update', (apps) => setApp(apps[0])));
 * const authorized = useAppAuth(app?.auth);
 * if (!app || !authorized) return null;
 * return <SomeComponent />
 */
export const useAppAuth = (appAuths?: AppAuth[]) => {

    const { auth: { container: authContainer } } = useFusionContext();
    const [authenticated, setAuthenticated] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!appAuths) return;
        (async () => {
            for (const { clientId, resources } of appAuths) {
                const isLoggedin = await authContainer.registerAppAsync(clientId, resources);
                if (!isLoggedin) {
                    return await authContainer.loginAsync(clientId);
                }
            }
            setAuthenticated(true);
        })();
    }, appAuths);

    return !appAuths || authenticated;
};

export default useAppAuth;