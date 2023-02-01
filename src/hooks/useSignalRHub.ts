import { useState, useEffect, useMemo, useCallback } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useFusionContext } from '../core/FusionContext';

export default (hubName: string) => {
    const [hubConnection, setHubConnection] = useState<HubConnection | null>(null);
    const [hubConnectionError, setHubConnectionError] = useState<Error | null>(null);
    const [isEstablishingHubConnection, setIsEstablishingHubConnection] = useState<boolean>(false);

    const {
        http: {
            resourceCollections: { fusion },
        },
        auth,
    } = useFusionContext();

    const signalRHubUrl = useMemo(() => fusion.signalRHub(hubName), [hubName, fusion]);

    const createHubConnectionAsync = useCallback(
        async (signal: AbortSignal) => {
            setHubConnectionError(null);
            const hubConnect = new HubConnectionBuilder()
                .withAutomaticReconnect()
                .withUrl(signalRHubUrl, {
                    accessTokenFactory: async () => {
                        const token = await auth.container.acquireTokenAsync(signalRHubUrl);
                        return token || '';
                    },
                })
                .build();

            signal.addEventListener('abort', () => {
                hubConnect?.stop();
                setHubConnection(null);
            });

            try {
                await hubConnect.start();
                setHubConnection(hubConnect);
            } catch (e) {
                setHubConnectionError(e as Error);
            } finally {
                setIsEstablishingHubConnection(false);
            }
        },
        [signalRHubUrl, auth]
    );

    useEffect(() => {
        const abortController = new AbortController();
        createHubConnectionAsync(abortController.signal);

        return () => {
            abortController.abort();
        };
    }, [createHubConnectionAsync]);

    return { hubConnection, hubConnectionError, isEstablishingHubConnection };
};
