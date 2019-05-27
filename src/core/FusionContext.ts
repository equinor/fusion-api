import { createContext, useContext, MutableRefObject } from "react";
import { History, createBrowserHistory } from "history";
import { IAuthContainer } from "../auth/AuthContainer";
import ResourceCollections, { createResourceCollections } from "../http/resourceCollections";
import ApiClients, { createApiClients } from "../http/apiClients";
import HttpClient from "../http/HttpClient";
import ResourceCache from "../http/ResourceCache";
import ServiceResolver from "../http/resourceCollections/ServiceResolver";
import SettingsContainer from "../settings/SettingsContainer";
import AppContainer, { appContainer } from "../app/AppContainer";
import AppManifest from "../app/AppManifest";
import { ComponentDisplayType } from "../core/ComponentDisplayType";

export type Auth = {
    container: IAuthContainer;
};

export type Http = {
    resourceCollections: ResourceCollections;
    apiClients: ApiClients;
    resourceCache: ResourceCache;
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

export type App = {
    container: AppContainer;
    currentApp: {
        appKey: string;
        appPath: string;
        manifest: AppManifest | null;
    };
};

export interface IFusionContext {
    auth: Auth;
    http: Http;
    refs: Refs;
    history: History;
    settings: Settings;
    app: App;
}

export type CoreSettings = Readonly<{
    componentDisplayType: ComponentDisplayType;
}>;

export const defaultSettings: CoreSettings = {
    componentDisplayType: ComponentDisplayType.Comforable,
};

const FusionContext = createContext<IFusionContext>({} as IFusionContext);

export const createFusionContext = (
    authContainer: IAuthContainer,
    serviceResolver: ServiceResolver,
    refs: Refs
): IFusionContext => {
    const resourceCollections = createResourceCollections(serviceResolver);

    const resourceCache = new ResourceCache();
    const httpClient = new HttpClient(authContainer, resourceCache);
    const apiClients = createApiClients(httpClient, resourceCollections);

    const history = createBrowserHistory();

    const coreSettings = new SettingsContainer("core", defaultSettings);

    return {
        auth: { container: authContainer },
        http: {
            resourceCollections,
            apiClients,
            resourceCache,
        },
        refs,
        history,
        settings: {
            core: coreSettings,
            apps: {},
        },
        app: {
            container: appContainer,
            currentApp: {
                appKey: "",
                appPath: "/",
                manifest: null,
            },
        },
    };
};

export const useFusionContext = () => useContext(FusionContext);

export default FusionContext;
