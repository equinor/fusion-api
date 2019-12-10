import AppManifest from './AppManifest';
import EventEmitter, { useEventEmitterValue } from '../utils/EventEmitter';
import ApiClients from '../http/apiClients';
import FusionClient from '../http/apiClients/FusionClient';
import { useFusionContext } from '../core/FusionContext';
import { useEffect, useState } from 'react';
import TelemetryLogger from '../utils/TelemetryLogger';
import { ContextManifest } from '../http/apiClients/models/context/ContextManifest';
import { Context } from '../http/apiClients/models/context/Context';

type AppRegistration = {
    AppComponent: React.ComponentType;
    context?: ContextManifest;
    buildURL?: (context: Context) => string;
    getContextFromUrl?: (url: string) => string;
};

type AppContainerEvents = {
    update: (app: AppManifest) => void;
    change: (app: AppManifest | null) => void;
};

export default class AppContainer extends EventEmitter<AppContainerEvents> {
    previousApp: AppManifest | null = null;
    currentApp: AppManifest | null = null;
    private apps: AppManifest[] = [];
    private readonly fusionClient: FusionClient;
    private readonly telemetryLogger: TelemetryLogger;

    constructor(apiClients: ApiClients, telemetryLogger: TelemetryLogger) {
        super();
        this.fusionClient = apiClients.fusion;
        this.telemetryLogger = telemetryLogger;
    }

    updateManifest(appKey: string, manifest: AppManifest): void {
        const existingApp = this.get(appKey);

        // Ensure app key on the manifest
        manifest = {
            ...manifest,
            key: appKey,
        };

        if (existingApp === null) {
            const newApp = manifest;
            this.addOrUpdate(newApp);
            this.fetchIconAsync(appKey);
        } else {
            const updatedApp = { ...existingApp, ...manifest };
            this.addOrUpdate(updatedApp);
        }
    }

    get(appKey: string | null) {
        return this.apps.find(app => app.key === appKey) || null;
    }

    getAll() {
        return [...this.apps];
    }

    async setCurrentAppAsync(appKey: string | null): Promise<void> {
        if (!appKey) {
            this.previousApp = this.currentApp;
            this.currentApp = null;
            this.emit('change', null);
            return;
        }

        const app = this.get(appKey);

        if (!app) {
            const { data: manifest } = await this.fusionClient.getAppManifestAsync(appKey);
            const appManifest = manifest as AppManifest;
            this.updateManifest(appKey, appManifest);
            return await this.setCurrentAppAsync(appKey);
        }

        if (!app.AppComponent) {
            await this.fusionClient.loadAppScriptAsync(appKey);
            return await this.setCurrentAppAsync(appKey);
        }

        if (this.currentApp) {
            this.previousApp = this.currentApp;
        }

        // Log custom event - new app and prev app
        this.telemetryLogger.trackEvent({
            name: 'App selected',
            properties: {
                previousApp: this.previousApp ? this.previousApp.name : null,
                currentApp: app.name,
            },
        });

        this.currentApp = app;
        this.emit('change', app);
    }

    async getAllAsync() {
        const response = await this.fusionClient.getAppsAsync();
        response.data.forEach(manifest =>
            this.updateManifest(manifest.key, manifest as AppManifest)
        );

        return this.getAll();
    }

    private async fetchIconAsync(appKey: string) {
        const app = this.get(appKey);

        if (!app) {
            return;
        }

        const response = await this.fusionClient.getAppIconAsync(appKey);
        const appWithIcon = { ...app, icon: response.data };
        this.addOrUpdate(appWithIcon);
    }

    private addOrUpdate(app: AppManifest) {
        const existingApp = this.get(app.key);

        if (existingApp) {
            this.apps = this.apps.map(a => (a.key === app.key ? app : a));
        } else {
            this.apps = [...this.apps, app];
        }

        this.emit('update', app);
    }
}

const global = window as any;

global['EQUINOR_FUSION_APP_CONTAINER'] = null;

let appContainerPromise: Promise<AppContainer> | null = null;
let setAppContainerSingleton: ((appContainer: AppContainer) => void) | null;
const appContainerFactory = (appContainer: AppContainer) => {
    global['EQUINOR_FUSION_APP_CONTAINER'] = appContainer;

    if (setAppContainerSingleton) {
        setAppContainerSingleton(appContainer);
        setAppContainerSingleton = null;
    }
};

const getAppContainer = (): Promise<AppContainer> => {
    if (global['EQUINOR_FUSION_APP_CONTAINER']) {
        return Promise.resolve(global['EQUINOR_FUSION_APP_CONTAINER']);
    }

    if (appContainerPromise) {
        return appContainerPromise;
    }

    appContainerPromise = new Promise(resolve => {
        setAppContainerSingleton = resolve;
    });

    return appContainerPromise;
};

const registerApp = (appKey: string, manifest: AppRegistration): void => {
    getAppContainer().then(appContainer =>
        appContainer.updateManifest(appKey, manifest as AppManifest)
    );
};

const useCurrentApp = () => {
    const { app } = useFusionContext();
    const [currentApp] = useEventEmitterValue(
        app.container,
        'change',
        app => app,
        app.container.currentApp
    );
    return currentApp;
};

const useApps = (): [Error | null, boolean, AppManifest[]] => {
    const { app } = useFusionContext();
    const [apps, setApps] = useState<AppManifest[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    const fetchApps = async () => {
        setIsFetching(true);

        try {
            const allApps = await app.container.getAllAsync();
            setApps(allApps);
        } catch (e) {
            setError(e);
        }

        setIsFetching(false);
    };

    useEffect(() => {
        fetchApps();
        return app.container.on('update', () => setApps(app.container.getAll()));
    }, []);

    return [error, isFetching, apps];
};

export { registerApp, appContainerFactory, AppManifest, useCurrentApp, useApps };
