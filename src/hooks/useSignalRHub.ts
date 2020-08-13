import { useState, useEffect, useMemo } from 'react';
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

    const createHubConnectionAsync = async () => {
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
        try {
            await hubConnect.start();
            setHubConnection(hubConnect);
        } catch (e) {
            setHubConnectionError(e);
        } finally {
            setIsEstablishingHubConnection(false);
        }
    };

    useEffect(() => {
        createHubConnectionAsync();

        return () => {
            hubConnection?.stop();
        };
    }, [signalRHubUrl]);

    return { hubConnection, hubConnectionError, isEstablishingHubConnection };
};
