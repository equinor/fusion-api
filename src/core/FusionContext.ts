import { createContext, useContext, useRef, MutableRefObject } from "react";
import { History, createBrowserHistory } from "history";
import { IAuthContainer } from "../auth/AuthContainer";
import ResourceCollections, { createResourceCollections } from "../http/resourceCollections";
import ApiClients, { createApiClients } from "../http/apiClients";
import HttpClient from "../http/HttpClient";
import ServiceResolver from "../http/resourceCollections/ServiceResolver";

type Auth = {
    container: IAuthContainer;
};

type Http = {
    resourceCollections: ResourceCollections;
    apiClients: ApiClients;
};

type Refs = {
    root: MutableRefObject<HTMLElement | null>;
    overlay: MutableRefObject<HTMLElement | null>;
};

export interface IFusionContext {
    auth: Auth;
    http: Http;
    refs: Refs;
    history: History;
}

const FusionContext = createContext<IFusionContext>({} as IFusionContext);

export const createFusionContext = (
    authContainer: IAuthContainer,
    serviceResolver: ServiceResolver,
    refs: Refs
): IFusionContext => {
    const resourceCollections = createResourceCollections(serviceResolver);

    const httpClient = new HttpClient(authContainer);
    const apiClients = createApiClients(httpClient, resourceCollections);

    const history = createBrowserHistory();

    return {
        auth: { container: authContainer },
        http: {
            resourceCollections,
            apiClients,
        },
        refs,
        history,
    };
};

export const useFusionContext = () => useContext(FusionContext);

export default FusionContext;
