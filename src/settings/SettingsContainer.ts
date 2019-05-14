type Settings = {
    [key: string]: any;
};

export type ReadOnlySettings = Readonly<Settings>;

export interface IReadOnlySettingsContainer {
    get<T>(key: string): Readonly<T>;
}

export interface ISettingsContainer extends IReadOnlySettingsContainer {
    set<T>(key: string, value: T): void;
}

export default class SettingsContainer implements ISettingsContainer {
    private readonly baseKey: string;
    private readonly values: Settings = [];

    static createFromCache(baseKey: string): SettingsContainer {
        const settingsContainer = new SettingsContainer(baseKey);

        const json = localStorage.getItem(SettingsContainer.createKey(baseKey));

        if (json !== null) {
            const cachedSettings = JSON.parse(json) as ReadOnlySettings;
            settingsContainer.populateFromcache(cachedSettings);
        }
        return settingsContainer;
    }

    private static createKey(baseKey: string) {
        return `FUSION_SETTINGS_CACHE:${baseKey}`;
    }

    private constructor(baseKey: string) {
        this.baseKey = baseKey;
    }

    set<T>(key: string, value: T): void {
        this.values[key] = value;
        this.persistToCache();
    }

    get<T>(key: string): Readonly<T> {
        return this.values[key] as Readonly<T>;
    }

    toObject(): ReadOnlySettings {
        return JSON.parse(JSON.stringify(this.values));
    }

    private populateFromcache(cachedSettings: ReadOnlySettings): void {
        for (const key in cachedSettings) {
            this.set(key, cachedSettings[key]);
        }
    }

    private persistToCache(): void {
        const json = JSON.stringify(this.values);
        localStorage.setItem(SettingsContainer.createKey(this.baseKey), json);
    }
}
