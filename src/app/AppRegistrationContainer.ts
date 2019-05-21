import * as uuid from "uuid/v1";
import { AppManifest } from "./AppManifest";
import { AppRegistrationListener, AppRegistrationUnsubscribe } from "./AppRegistrationListener";

type RegisteredApp = {
    appKey: string;
    manifest: AppManifest;
};

type RegisterAppMessage = {
    type: string;
    appKey: string;
    tempManifestKey: string;
}

const REGISTER_FUSION_APP = "REGISTER_FUSION_APP";

export default class AppRegistrationContainer {
    private listeners: AppRegistrationListener[] = [];
    private registeredApps: RegisteredApp[] = [];

    registerApp(appKey: string, manifest: AppManifest): void {
        const tempManifestKey = uuid();
        (window as any)[tempManifestKey] = manifest;

        const message: RegisterAppMessage = {
            type: REGISTER_FUSION_APP,
            appKey,
            tempManifestKey,
        };

        window.postMessage(message,
            window.location.href
        );
    }

    registerAppListener(listner: AppRegistrationListener): AppRegistrationUnsubscribe {
        this.listeners.push(listner);
        this.registeredApps.forEach(app => listner(app.appKey, app.manifest));
        return () => this.listeners.splice(this.listeners.indexOf(listner), 1);
    }

    notifyListeners(appKey: string, manifest: AppManifest): void {
        this.listeners.forEach(listener => listener(appKey, manifest));

        this.registeredApps.push({
            appKey,
            manifest,
        });
    }
}

const singleton = new AppRegistrationContainer();

window.addEventListener("message", e => {
    if (e.data && e.data.type === REGISTER_FUSION_APP && e.origin === window.location.origin) {
        const { appKey, tempManifestKey } = e.data as RegisterAppMessage;
        const manifest = (window as any)[tempManifestKey];

        if(typeof manifest === "undefined" || !manifest) {
            return;
        }

        delete (window as any)[tempManifestKey];

        singleton.notifyListeners(appKey, manifest as AppManifest);
    }
});

const registerApp = singleton.registerApp.bind(singleton);
const registerAppListener = singleton.registerAppListener.bind(singleton);

export { registerApp, registerAppListener };