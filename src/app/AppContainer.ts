import AppManifest from "./AppManifest";
import EventEmitter from "../utils/EventEmitter";
import ApiClients from "../http/apiClients";
import FusionClient from "../http/apiClients/FusionClient";
import { useFusionContext } from "../core/FusionContext";
import { useEffect, useState } from 'react';

type AppRegistration = {
    AppComponent: React.ComponentType;
};

type AppContainerEvents = {
    update: (app: AppManifest) => void;
    change: (app: AppManifest) => void;
};

export default class AppContainer extends EventEmitter<AppContainerEvents> {
    currentApp: AppManifest | null = null;
    private apps: AppManifest[] = [];
    private readonly fusionClient: FusionClient;

    constructor(apiClients: ApiClients) {
        super();
        this.fusionClient = apiClients.fusion;
    }

    updateManifest(appKey: string, manifest: AppManifest): void {
        const existingApp = this.get(appKey);

        if (existingApp === null) {
            const newApp = manifest;
            this.addOrUpdate(newApp);
        } else {
            const updatedApp = { ...existingApp, ...manifest };
            this.addOrUpdate(updatedApp);
        }
    }

    get(appKey: string | null) {
        return this.apps.find(app => app.key === appKey) || null;
    }

    getAll() {
        return this.apps as Readonly<AppManifest[]>;
    }

    async setCurrentAppAsync(appKey: string | null) {
        const app = this.get(appKey);
        if (app || !appKey) {
            this.currentApp = app;
            return this.emit("change", app);
        }

        const { data: manifest } = await this.fusionClient.getAppManifestAsync(appKey);
        const appManifest = manifest as AppManifest;
        this.updateManifest(appKey, appManifest);

        await this.fusionClient.loadAppScriptAsync(appKey);

        this.currentApp = appManifest;
        this.emit("change", manifest);
    }

    async getAllAsync() {
        const response = await this.fusionClient.getAppsAsync();
        response.data.forEach(manifest =>
            this.updateManifest(manifest.key, manifest as AppManifest)
        );

        return this.getAll();
    }

    private addOrUpdate(app: AppManifest) {
        const existingApp = this.get(app.key);

        if (existingApp) {
            this.apps = this.apps.map(a => (a.key === app.key ? app : a));
        } else {
            this.apps = [...this.apps, app];
        }

        this.emit("update", app);
    }
}

let appContainerSingleton: AppContainer | null = null;

let appContainerPromise: Promise<AppContainer> | null = null;
let setAppContainerSingleton: ((appContainer: AppContainer) => void) | null;
const appContainerFactory = (appContainer: AppContainer) => {
    appContainerSingleton = appContainer;

    if (setAppContainerSingleton) {
        setAppContainerSingleton(appContainer);
        setAppContainerSingleton = null;
    }
};

const getAppContainer = (): Promise<AppContainer> => {
    if (appContainerSingleton) {
        return Promise.resolve(appContainerSingleton);
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

    const [_, forceUpdate] = useState();
    useEffect(() => {
        return app.container.on("change", () => forceUpdate(null));
    }, []);

    return app.container.currentApp;
};

export { registerApp, appContainerFactory, AppManifest, useCurrentApp };
