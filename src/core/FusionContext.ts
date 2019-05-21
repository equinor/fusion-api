import { createContext, useContext, useRef, MutableRefObject } from "react";
import { History, createBrowserHistory } from "history";
import { IAuthContainer } from "../auth/AuthContainer";
import ResourceCollections, { createResourceCollections } from "../http/resourceCollections";
import ApiClients, { createApiClients } from "../http/apiClients";
import HttpClient from "../http/HttpClient";
import ServiceResolver from "../http/resourceCollections/ServiceResolver";
import SettingsContainer from "../settings/SettingsContainer";

export type Auth = {
    container: IAuthContainer;
};

export type Http = {
    resourceCollections: ResourceCollections;
    apiClients: ApiClients;
};

export type Refs = {
    root: MutableRefObject<HTMLElement | null>;
    overlay: MutableRefObject<HTMLElement | null>;
};

export type AppSettings = {
    [key: string]: SettingsContainer;
};

export type Settings = {
    core: SettingsContainer;

    /**
     * App settings will be populated on demand when using useAppSettings()
     */
    apps: AppSettings;
};

export interface IFusionContext {
    auth: Auth;
    http: Http;
    refs: Refs;
    history: History;
    settings: Settings;
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

    const coreSettings = new SettingsContainer("core");

    return {
        auth: { container: authContainer },
        http: {
            resourceCollections,
            apiClients,
        },
        refs,
        history,
        settings: {
            core: coreSettings,
            apps: {},
        },
    };
};

export const useFusionContext = () => useContext(FusionContext);

export default FusionContext;
