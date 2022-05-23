/* eslint-disable no-fallthrough */
import AppManifest from './AppManifest';
import EventEmitter, { useEventEmitterValue } from '../utils/EventEmitter';
import ApiClients from '../http/apiClients';
import FusionClient from '../http/apiClients/FusionClient';
import { useFusionContext } from '../core/FusionContext';
import { useEffect, useState } from 'react';
import { TelemetryLogger } from '../utils/telemetry';
import FeatureLogger from '../utils/FeatureLogger';
import DistributedState, { IDistributedState } from '../utils/DistributedState';
import { IEventHub } from '../utils/EventHub';
import { ContextManifest } from '../http/apiClients/models/context/ContextManifest';
import { AppAuth } from '../http/apiClients/models/fusion/apps/AppManifest';

type AppRegistration = {
    AppComponent: React.ComponentType;
    // TODO - WIP: workaround while having fusion API and Fusion Framework
    render?: (fusion: any, env: AppManifest) => React.LazyExoticComponent<React.ComponentType>;
    name?: string;
    shortName?: string;
    description?: string;
    context?: ContextManifest;
    auth?: AppAuth[];
    icon?: string;
};

type AppContainerEvents = {
    update: (app: Record<string, AppManifest>) => void;
    change: (app: AppManifest | null) => void;
    fetch: (status: boolean) => void;
};

/**
 * Api model for app config endpoint
 */
type ApiAppConfig<T> = {
    environment: T;
    endpoints: Record<string, string>;
};

const compare = (x: string[], y: string[]): boolean => {
    for (const tag of x) {
        if (y.includes(tag)) {
            return true;
        }
    }
    return false;
};

const compareApp = (a: AppManifest, b?: AppManifest) => {
    if (!b) return true;
    const attr = Object.keys(a) as Array<keyof AppManifest>;
    return attr.some((key) => {
        switch (key) {
            case 'auth':
            //@todo maybe?!?!
            case 'context':
            case 'tags':
                return compare(a.tags, b.tags);

            case 'category':
                return a.category?.id !== b.category?.id;
            // Dates
            case 'publishedDate':
                return String(a[key]) !== String(b[key]);

            default:
                return a[key] !== b[key];
        }
    });
};

const compareApps = (a: Record<string, AppManifest>, b: Record<string, AppManifest>): boolean => {
    if (!a || !b) return (a as any) === (b as any);
    if (Object.keys(a).length !== Object.keys(b).length) return true;
    return Object.keys(a).some((key) => compareApp(a[key], b[key]));
};

export default class AppContainer extends EventEmitter<AppContainerEvents> {
    private _currentApp: IDistributedState<AppManifest | null>;
    private apps: IDistributedState<Record<string, AppManifest>>;
    previousApps: IDistributedState<Record<string, AppManifest>>;

    private _isUpdating?: boolean;
    get isUpdating(): boolean {
        return !!this._isUpdating;
    }

    private _lastUpdated?: number;
    get lastUpdated() {
        return this._lastUpdated;
    }

    get requireUpdate(): boolean {
        return !this._isUpdating;
    }

    private _updatePromise: Promise<void> = Promise.resolve();
    get updateComplete() {
        return this._updatePromise;
    }

    get currentApp() {
        return this._currentApp.state;
    }

    get allApps() {
        return this.apps.state;
    }

    private readonly fusionClient: FusionClient;
    private readonly telemetryLogger: TelemetryLogger;

    constructor(
        apiClients: ApiClients,
        telemetryLogger: TelemetryLogger,
        private readonly featureLogger: FeatureLogger,
        eventHub: IEventHub
    ) {
        super();
        this.fusionClient = apiClients.fusion;
        this.telemetryLogger = telemetryLogger;
        this._currentApp = new DistributedState<AppManifest | null>(
            'AppContainer.currentApp',
            null,
            eventHub
        );
        this._currentApp.on('change', (updatedApp: AppManifest | null) => {
            this.emit('change', updatedApp);
        });

        this.apps = new DistributedState<Record<string, AppManifest>>(
            'AppContainer.apps',
            {},
            eventHub
        );
        this.apps.on('change', (apps) => this.emit('update', apps));

        this.previousApps = new DistributedState<Record<string, AppManifest>>(
            'AppContainer.previousApps',
            {},
            eventHub
        );

        this.on('fetch', (fetching) => (this._isUpdating = fetching));
    }

    updateManifest(manifest: AppManifest): void {
        this.addOrUpdate({ [manifest.key]: manifest });
    }

    get(appKey: string | null) {
        return appKey && this.apps.state[appKey];
    }

    getAll() {
        return Object.values(this.apps.state);
    }

    async setCurrentAppAsync(appKey: string | null): Promise<void> {
        const previousApp = this.previousApps.state[0];
        if (this.currentApp && (!previousApp || previousApp.key !== appKey)) {
            this.previousApps.state = {
                ...this.previousApps.state,
                [this.currentApp.key]: this.currentApp,
            };
        }

        if (!appKey) {
            this.featureLogger.log('App selected', '0.0.1', {
                selectedApp: null,
                previousApps: Object.keys(this.previousApps.state).map((key) => ({
                    key,
                    name: this.previousApps.state[key].name,
                })),
            });

            this.featureLogger.setCurrentApp(null);

            this._currentApp.state = null;
            this.emit('change', null);
            return;
        }

        const app = this.get(appKey);

        if (!app) {
            const { data: manifest } = await this.fusionClient.getAppManifestAsync(appKey);
            const appManifest = { ...manifest, key: appKey } as AppManifest;
            this.updateManifest(appManifest);
            return await this.setCurrentAppAsync(appKey);
        }

        if (!app.AppComponent) {
            await this.fusionClient.loadAppScriptAsync(appKey);
            return await this.setCurrentAppAsync(appKey);
        }

        this.telemetryLogger.trackEvent({
            name: 'App selected',
            properties: {
                previousApp: this._currentApp.state ? this._currentApp.state.name : null,
                selectedApp: app.name,
                previousApps: Object.keys(this.previousApps.state).map(
                    (key) => this.previousApps.state[key].name
                ),
                currentApp: app.name,
            },
        });

        if (!app.context) {
            // Reset context on feature logger if current app does not support it
            this.featureLogger.setCurrentContext(null, null);
        }

        this.featureLogger.log('App selected', '0.0.1', {
            selectedApp: {
                key: app.key,
                name: app.name,
            },
            previousApps: Object.keys(this.previousApps.state).map((key) => ({
                key,
                name: this.previousApps.state[key].name,
            })),
        });

        this.featureLogger.setCurrentApp(app.key);

        this._currentApp.state = app;
        this.emit('change', app);
    }

    async getAllAsync() {
        await this.requestUpdate();
        return this.allApps;
    }

    public requestUpdate(): Promise<void> {
        return this.requireUpdate ? this.update() : this._updatePromise;
    }

    private update(): Promise<void> {
        // eslint-disable-next-line no-async-promise-executor
        this._updatePromise = new Promise(async (resolve, reject) => {
            try {
                this.emit('fetch', true);
                const response = await this.fusionClient.getAppsAsync();
                const apps = response.data.reduce(
                    (cur, val) => Object.assign(cur, { [val.key]: val }),
                    {}
                );
                this.addOrUpdate(apps);
                this._lastUpdated = Date.now();
                resolve();
            } catch (err) {
                reject(err);
            } finally {
                this.emit('fetch', false);
            }
        });
        return this._updatePromise;
    }

    private addOrUpdate(apps: Record<string, AppManifest>) {
        if (compareApps(this.apps.state, apps)) {
            const nextState = Object.keys(apps).reduce(
                (cur, key) => ({ ...cur, [key]: { ...cur[key], ...apps[key] } }),
                { ...this.apps.state }
            );
            this.apps.state = Object.freeze({ ...this.apps.state, ...nextState });
        }
    }

    private readonly configCache: Record<string, unknown> = {};

    async getConfigAsync<T>(
        tag?: string | null,
        cancellationToken?: AbortSignal
    ): Promise<ApiAppConfig<T>> {
        const appKey = this._currentApp.state?.key;
        const tagCacheKey = `${appKey}-${tag ?? 'default'}`;

        // We cannot get configs without an active app..
        if (!appKey) {
            throw new Error('Current app is null, cannot get config');
        }

        // Try to resolve from cache
        const cachedConfig = this.configCache[tagCacheKey];
        if (cachedConfig) {
            return cachedConfig as ApiAppConfig<T>;
        }

        // Fetch from store
        const getConfigUrl = (appKey: string, tag: string | null = null) => {
            let url = `/api/apps/${appKey}/config`;
            if (tag) {
                url += `?tag=${tag}`;
            }
            return url;
        };

        const resp = await this.fusionClient.getAsync<ApiAppConfig<T>>(getConfigUrl(appKey, tag), {
            signal: cancellationToken,
        });
        this.configCache[tagCacheKey] = resp.data;

        return resp.data;
    }
}

let appContainerInstance: AppContainer | null = null;

let appContainerPromise: Promise<AppContainer> | null = null;
let setAppContainerSingleton: ((appContainer: AppContainer) => void) | null;
const appContainerFactory = (appContainer: AppContainer) => {
    appContainerInstance = appContainer;

    if (setAppContainerSingleton) {
        setAppContainerSingleton(appContainer);
        setAppContainerSingleton = null;
    }
};

const getAppContainer = (): Promise<AppContainer> => {
    if (appContainerInstance) {
        return Promise.resolve(appContainerInstance);
    }

    if (appContainerPromise) {
        return appContainerPromise;
    }

    appContainerPromise = new Promise((resolve) => {
        setAppContainerSingleton = resolve;
    });

    return appContainerPromise;
};

const registerApp = (key: string, manifest: AppRegistration): void => {
    getAppContainer().then((appContainer) =>
        appContainer.updateManifest({ ...manifest, key } as AppManifest)
    );
};

const useCurrentApp = () => {
    const { app } = useFusionContext();
    useEventEmitterValue(app.container, 'change', (app) => app, app.container.currentApp);

    // Only to get notified/rerendered when changes are made to the current app
    useEventEmitterValue(app.container, 'update');

    return app.container.currentApp;
};

const useApps = (
    buffer = 60000
): {
    error: Error | null;
    initialized: boolean;
    isFetching: boolean;
    apps: Record<string, AppManifest>;
} => {
    const {
        app: { container },
    } = useFusionContext();
    const [apps, setApps] = useState(container.allApps);
    const [isFetching, setIsFetching] = useState<boolean>(container.isUpdating);
    const [initialized, setInitialized] = useState<boolean>(
        (container.lastUpdated || 0) + buffer >= Date.now()
    );
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => container.on('fetch', (status) => setIsFetching(status)), []);
    useEffect(() => {
        !initialized &&
            container
                .requestUpdate()
                .then(() => setInitialized(true))
                .catch(setError);
        return container.on('update', setApps);
    }, []);

    return { error, initialized, isFetching, apps };
};

export { registerApp, appContainerFactory, AppManifest, useCurrentApp, useApps };
