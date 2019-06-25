import { createContext, useContext, MutableRefObject } from "react";
import { History, createBrowserHistory } from "history";
import { IAuthContainer } from "../auth/AuthContainer";
import { matchPath } from "react-router";
import ResourceCollections, { createResourceCollections } from "../http/resourceCollections";
import ApiClients, { createApiClients } from "../http/apiClients";
import HttpClient, { IHttpClient } from "../http/HttpClient";
import ResourceCache from "../http/ResourceCache";
import ServiceResolver from "../http/resourceCollections/ServiceResolver";
import SettingsContainer from "../settings/SettingsContainer";
import AppContainer, { appContainer } from "../app/AppContainer";
import AppManifest from "../app/AppManifest";
import { ComponentDisplayType } from "../core/ComponentDisplayType";
import ContextManager from "./ContextManager";
import AbortControllerManager from "../utils/AbortControllerManager";

export type Auth = {
    container: IAuthContainer;
};

export type Http = {
    client: IHttpClient;
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
    core: SettingsContainer<CoreSettings>;

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
    contextManager: ContextManager;
    abortControllerManager: AbortControllerManager;
}

export type CoreSettings = {
    readonly componentDisplayType: ComponentDisplayType;
};

export const defaultSettings: CoreSettings = {
    componentDisplayType: ComponentDisplayType.Comfortable,
};

type ContextRouteMatch = {
    contextId: string;
};

const FusionContext = createContext<IFusionContext>({} as IFusionContext);

export const createFusionContext = (
    authContainer: IAuthContainer,
    serviceResolver: ServiceResolver,
    refs: Refs
): IFusionContext => {
    const abortControllerManager = new AbortControllerManager();
    const resourceCollections = createResourceCollections(serviceResolver);

    const resourceCache = new ResourceCache();
    const httpClient = new HttpClient(authContainer, resourceCache, abortControllerManager);
    const apiClients = createApiClients(httpClient, resourceCollections);

    const history = createBrowserHistory();

    const coreSettings = new SettingsContainer<CoreSettings>("core", authContainer.getCachedUser(), defaultSettings);

    // Try to get the current context id from the current route if a user navigates directly to the app/context
    const contextRouteMatch = matchPath<ContextRouteMatch>("apps/:appKey/:contextId", {
        path: history.location.pathname,
    });
    const contextId = contextRouteMatch && contextRouteMatch.params ? contextRouteMatch.params.contextId : null;

    const contextManager = new ContextManager(apiClients, contextId);

    return {
        auth: { container: authContainer },
        http: {
            client: httpClient,
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
        contextManager,
        abortControllerManager,
    };
};

export const useFusionContext = () => useContext(FusionContext);

export default FusionContext;
