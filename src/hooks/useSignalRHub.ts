import { useState, useCallback, useEffect } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { SignalRNegotiation } from '../http/apiClients/models/fusion/SignalRNegotiation';
import useApiClients from '../http/hooks/useApiClients';

export default (hubName: string) => {
    const [hubDetails, setHubDetails] = useState<SignalRNegotiation | null>(null);
    const [hubConnection, setHubConnection] = useState<HubConnection | null>(null);
    const [hubConnectionError, setHubConnectionError] = useState<Error | null>(null);
    const [isEstablishingHubConnection, setIsEstablishingHubConnection] = useState<boolean>(false);
    const apiClients = useApiClients();

    const getSignalRHubNegotiationDetails = useCallback(async () => {
        setIsEstablishingHubConnection(true);
        setHubConnectionError(null);

        try {
            const response = await apiClients.fusion.negotiateSignalRHub(hubName);
            setHubDetails(response.data);
        } catch (e) {
            setHubConnectionError(e);
            console.error(e);
        }
    }, [apiClients]);

    const createHubConnectionAsync = useCallback(async (hubDetails: SignalRNegotiation) => {
        setHubConnectionError(null);

        const hubConnect = new HubConnectionBuilder()
            .withAutomaticReconnect()
            .withUrl(hubDetails.url, {
                accessTokenFactory: async () => hubDetails.accessToken,
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
    }, []);

    useEffect(() => {
        getSignalRHubNegotiationDetails();
    }, []);

    useEffect(() => {
        if (hubDetails) {
            createHubConnectionAsync(hubDetails);
        }

        return () => {
            hubConnection?.stop();
        };
    }, [hubDetails]);

    return { hubConnection, hubConnectionError, isEstablishingHubConnection };
};
