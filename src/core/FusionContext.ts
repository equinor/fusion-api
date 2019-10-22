import { createContext, useContext, MutableRefObject, useRef } from 'react';
import { History, createBrowserHistory } from 'history';
import { IAuthContainer } from '../auth/AuthContainer';
import { matchPath } from 'react-router';
import ResourceCollections, { createResourceCollections } from '../http/resourceCollections';
import ApiClients, { createApiClients } from '../http/apiClients';
import HttpClient, { IHttpClient } from '../http/HttpClient';
import ResourceCache from '../http/ResourceCache';
import ServiceResolver from '../http/resourceCollections/ServiceResolver';
import SettingsContainer from '../settings/SettingsContainer';
import AppContainer, { appContainerFactory } from '../app/AppContainer';
import { ComponentDisplayType } from '../core/ComponentDisplayType';
import ContextManager from './ContextManager';
import AbortControllerManager from '../utils/AbortControllerManager';
import TasksContainer from './TasksContainer';
import NotificationCenter from './NotificationCenter';
import PeopleContainer from './PeopleContainer';
import UserMenuContainer from './UserMenuContainer';

export type Auth = {
    container: IAuthContainer;
};

export type Http = {
    client: IHttpClient;
    resourceCollections: ResourceCollections;
    apiClients: ApiClients;
    resourceCache: ResourceCache;
    serviceResolver: ServiceResolver;
};

export type ExternalRefs = {
    root: MutableRefObject<HTMLElement | null>;
    overlay: MutableRefObject<HTMLElement | null>;
};

export type Refs = ExternalRefs & {
    headerContent: MutableRefObject<HTMLElement | null>;
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
};

export interface IFusionContext {
    auth: Auth;
    http: Http;
    refs: Refs;
    history: History;
    settings: Settings;
    app: App;
    contextManager: ContextManager;
    tasksContainer: TasksContainer;
    abortControllerManager: AbortControllerManager;
    notificationCenter: NotificationCenter;
    peopleContainer: PeopleContainer;
    userMenuSectionsContainer: UserMenuContainer;
    environment: FusionEnvironment;
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

export type FusionEnvironment = {
    env: string;
    pullRequest?: string;
};

export type FusionContextOptions = {
    loadBundlesFromDisk: boolean;
    environment: FusionEnvironment;
};

const ensureGlobalFusionContextType = () => {
    const win = window as any;
    const key = 'EQUINOR_FUSION_CONTEXT';

    if (typeof win[key] !== undefined && win[key]) {
        return win[key] as React.Context<IFusionContext>;
    }

    const fusionContext = createContext<IFusionContext>({} as IFusionContext);
    win[key] = fusionContext;
    return fusionContext;
};

const FusionContext = ensureGlobalFusionContextType();

export const createFusionContext = (
    authContainer: IAuthContainer,
    serviceResolver: ServiceResolver,
    refs: ExternalRefs,
    options: FusionContextOptions
): IFusionContext => {
    const abortControllerManager = new AbortControllerManager();
    const resourceCollections = createResourceCollections(serviceResolver, options);

    const resourceCache = new ResourceCache();
    const httpClient = new HttpClient(authContainer, resourceCache, abortControllerManager);
    const apiClients = createApiClients(httpClient, resourceCollections);

    const history = createBrowserHistory();

    const coreSettings = new SettingsContainer<CoreSettings>(
        'core',
        authContainer.getCachedUser(),
        defaultSettings
    );

    const appContainer = new AppContainer(apiClients);
    appContainerFactory(appContainer);

    // Try to get the current context id from the current route if a user navigates directly to the app/context
    const contextRouteMatch = matchPath<ContextRouteMatch>('apps/:appKey/:contextId', {
        path: history.location.pathname,
    });
    const contextId =
        contextRouteMatch && contextRouteMatch.params ? contextRouteMatch.params.contextId : null;

    const contextManager = new ContextManager(apiClients, contextId);
    const tasksContainer = new TasksContainer(apiClients);
    const notificationCenter = new NotificationCenter();
    const peopleContainer = new PeopleContainer(apiClients, resourceCollections);
    const userMenuSectionsContainer = new UserMenuContainer();

    return {
        auth: { container: authContainer },
        http: {
            client: httpClient,
            resourceCollections,
            apiClients,
            resourceCache,
            serviceResolver,
        },
        refs: {
            ...refs,
            headerContent: useRef<HTMLDivElement>(null),
        },
        history,
        settings: {
            core: coreSettings,
            apps: {},
        },
        app: {
            container: appContainer,
        },
        contextManager,
        tasksContainer,
        abortControllerManager,
        notificationCenter,
        peopleContainer,
        userMenuSectionsContainer,
        environment: options.environment,
    };
};

export const useFusionContext = () => useContext(FusionContext);

export default FusionContext;
