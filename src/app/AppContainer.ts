import AppManifest from "./AppManifest";
import EventEmitter from "../utils/EventEmitter";

type RegisteredApp = {
    appKey: string;
    manifest: AppManifest;
};

type AppContainerEvents = {
    update: (app: RegisteredApp) => void;
}

export default class AppContainer extends EventEmitter<AppContainerEvents> {
    private apps: RegisteredApp[] = [];

    updateManifest(appKey: string, manifest: AppManifest): void {
        const existingApp = this.get(appKey);

        if(existingApp === null) {
            const newApp = { appKey, manifest };
            this.apps.push(newApp);
            this.emit("update", newApp);
        } else {
            existingApp.manifest = { ...existingApp.manifest, ...manifest };
            this.emit("update", existingApp);
        }
    }

    get(appKey: string): RegisteredApp | null {
        return this.apps.find(app => app.appKey === appKey) || null;
    }

    getAll() {
        return this.apps as Readonly<RegisteredApp[]>;
    }
}

const appContainer = new AppContainer();

const registerApp = (appKey: string, manifest: AppManifest): void => appContainer.updateManifest(appKey, manifest);

export { registerApp, appContainer, AppManifest };