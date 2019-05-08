import * as uuid from "uuid/v1";
import { AppManifest } from "./AppManifest";
import { AppRegistrationListener, AppRegistrationUnsubscribe } from "./AppRegistrationListener";

type RegisteredApp = {
    appKey: string;
    manifest: AppManifest;
};

const REGISTER_FUSION_APP = "REGISTER_FUSION_APP";

export default class AppRegistrationContainer {
    private listeners: AppRegistrationListener[] = [];
    private registeredApps: RegisteredApp[] = [];

    registerApp(appKey: string, manifest: AppManifest): void {
        const tempManifestKey = uuid();
        (window as any)[tempManifestKey] = manifest;

        window.postMessage(
            {
                type: REGISTER_FUSION_APP,
                appKey,
                tempManifestKey,
            },
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
        const { appKey, manifestKey } = e.data;
        const manifest = (window as any)[manifestKey];

        delete (window as any)[manifestKey];

        singleton.notifyListeners(appKey, manifest);
    }
});

const { registerApp, registerAppListener } = singleton;
export { registerApp, registerAppListener };
