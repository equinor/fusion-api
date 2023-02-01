import { createContext, useContext, MutableRefObject, useRef } from 'react';
import { History, createBrowserHistory } from 'history';
import { IAuthContainer } from '../auth/AuthContainer';
import { matchPath } from 'react-router';
import ResourceCollections, { createResourceCollections } from '../http/resourceCollections';
import ApiClients, { createApiClients } from '../http/apiClients';
import HttpClient, { IHttpClient } from '../http/HttpClient';
import ResourceCache from '../http/ResourceCache';
import ServiceResolver from '../http/resourceCollections/ServiceResolver';
import SettingsContainer, { AppSettingsContainer } from '../settings/SettingsContainer';
import AppContainer, { appContainerFactory } from '../app/AppContainer';
import { ComponentDisplayType } from '../core/ComponentDisplayType';
import ContextManager from './ContextManager';
import AbortControllerManager from '../utils/AbortControllerManager';
import TasksContainer from './TasksContainer';
import NotificationCenter from './NotificationCenter';
import PeopleContainer from './PeopleContainer';
import UserMenuContainer from './UserMenuContainer';
import { TelemetryLogger } from '../utils/telemetry';
import EventHub from '../utils/EventHub';
import FeatureLogger from '../utils/FeatureLogger';

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
    headerAppAside?: MutableRefObject<HTMLElement | null>;
};

export type AppSettings = {
    [key: string]: AppSettingsContainer;
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

export type Logging = {
    telemetry: TelemetryLogger;
    feature: FeatureLogger;
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
    logging: Logging;
    options?: FusionContextOptions;
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

export type TelemetryOptions = {
    instrumentationKey: string;
};

export type FusionContextOptions = {
    loadBundlesFromDisk: boolean;
    environment?: FusionEnvironment;
    telemetry?: TelemetryOptions;
};

const globalEquinorFusionContextKey = '74b1613f-f22a-451b-a5c3-1c9391e91e68';
const win = window as any;

const ensureFusionEnvironment = (options?: FusionContextOptions): FusionEnvironment => {
    if (options && options.environment) {
        return options.environment;
    }

    return {
        env: 'ci',
    };
};

export const createFusionContext = (
    authContainer: IAuthContainer,
    serviceResolver: ServiceResolver,
    refs: Refs,
    options?: FusionContextOptions,
    browserHistory?: History,
    args?: { appContainer: AppContainer }
): IFusionContext => {
    const telemetryLogger = new TelemetryLogger(
        options && options.telemetry ? options.telemetry.instrumentationKey : '',
        authContainer
    );

    const abortControllerManager = new AbortControllerManager(new EventHub());
    const resourceCollections = createResourceCollections(serviceResolver, options);

    const resourceCache = new ResourceCache(new EventHub());

    authContainer.setTelemetryLogger(telemetryLogger);

    const httpClient = new HttpClient(
        authContainer,
        resourceCache,
        abortControllerManager,
        telemetryLogger,
        new EventHub()
    );
    const apiClients = createApiClients(httpClient, resourceCollections, serviceResolver);

    const featureLogger = new FeatureLogger(apiClients, new EventHub());
    const history = browserHistory || createBrowserHistory();

    const coreSettings = new SettingsContainer<CoreSettings>(
        'core',
        authContainer.getCachedUser(),
        new EventHub(),
        defaultSettings
    );

    const appContainer =
        args?.appContainer ??
        new AppContainer(apiClients, telemetryLogger, featureLogger, new EventHub());

    appContainerFactory(appContainer);

    const contextManager = new ContextManager(
        apiClients,
        appContainer,
        featureLogger,
        telemetryLogger,
        history
    );
    const tasksContainer = new TasksContainer(apiClients, new EventHub());
    const notificationCenter = new NotificationCenter(new EventHub(), apiClients);
    const peopleContainer = new PeopleContainer(apiClients, resourceCollections, new EventHub());
    const userMenuSectionsContainer = new UserMenuContainer(new EventHub());
    const environment = ensureFusionEnvironment(options);

    const fusionContext = {
        auth: { container: authContainer },
        http: {
            client: httpClient,
            resourceCollections,
            apiClients,
            resourceCache,
            serviceResolver,
        },
        refs,
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
        environment,
        logging: {
            telemetry: telemetryLogger,
            feature: featureLogger,
        },
        options,
    };
    if (!win[globalEquinorFusionContextKey]) {
        win[globalEquinorFusionContextKey] = fusionContext;
    }
    return fusionContext;
};

const ensureGlobalFusionContextType = () => {
    if (!win[globalEquinorFusionContextKey]) {
        return createContext<IFusionContext>({} as IFusionContext);
    }
    const existingFusionContext = win[globalEquinorFusionContextKey] as IFusionContext;

    return createContext<IFusionContext>(
        createFusionContext(
            existingFusionContext.auth.container,
            existingFusionContext.http.serviceResolver,
            existingFusionContext.refs,
            existingFusionContext.options,
            existingFusionContext.history,
            {
                appContainer: existingFusionContext.app.container,
            }
        )
    );
};

const FusionContext = ensureGlobalFusionContextType();

export const useFusionContext = () => useContext(FusionContext);

export default FusionContext;
