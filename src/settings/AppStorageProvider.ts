import { IEventHub } from '../utils/EventHub';

import UserSettingsClient from '../http/apiClients/UserSettingsClient';
import EventEmitter from '../utils/EventEmitter';
import JSON from '../utils/JSON';
import DistributedState, { IDistributedState } from '../utils/DistributedState';
import IReliableDictionaryStorageProvider, {
    ReliableDictionaryStorageProviderEvents,
} from '../utils/ReliableDictionary/IReliableDictionaryStorageProvider';

type LocalCache = { [key: string]: any };

export default class AppStorageProvider
    extends EventEmitter<ReliableDictionaryStorageProviderEvents>
    implements IReliableDictionaryStorageProvider {
    private appKey: string;
    private baseKey: string;
    private userSettingsClient: UserSettingsClient;
    public isInitialized = false;
    public isInitializing = false;
    private localCache: IDistributedState<LocalCache | null>;

    constructor(
        baseKey: string,
        eventHub: IEventHub,
        userSettingsClient: UserSettingsClient,
        appKey: string,
        defaultSettings?: LocalCache
    ) {
        super();
        this.appKey = appKey;
        this.baseKey = baseKey;
        const cachedJson = localStorage.getItem(this.baseKey);
        const cachedValue = cachedJson ? JSON.parse<LocalCache>(cachedJson) : null;
        this.localCache = new DistributedState(
            `LocalStorageProvider.${baseKey}`,
            cachedValue,
            eventHub
        );

        if (!cachedValue && defaultSettings) {
            this.localCache.state = defaultSettings;
        }

        this.localCache.on('change', (value) => {
            this.emit('change', value);
        });
        this.userSettingsClient = userSettingsClient;
        this.initialize();
    }
    private async initialize() {
        try {
            this.isInitializing = true;
            const response = await this.userSettingsClient.getAppUserSettings(this.appKey);
            this.localCache.state = response.data;
            await this.persistAsync();
            this.isInitialized = true;
        } catch (e) {
            this.isInitialized = false;
        } finally {
            this.isInitializing = false;
        }
    }

    private async updateAppUserSettingsAsync(): Promise<void> {
        try {
            await this.userSettingsClient.updateAppUserSettings(this.appKey, this.localCache.state);
        } catch (e) {
            return;
        }
    }

    async getItemAsync<T>(key: string): Promise<T | null> {
        if (!this.isInitialized) {
            return null;
        }
        const localCache = await this.toObjectAsync();
        const value = localCache[key];

        if (!value) {
            return null;
        }

        return value as T;
    }

    async setItemAsync<T>(key: string, value: T): Promise<void> {
        const localCache = await this.toObjectAsync();
        this.localCache.state = { ...localCache, [key]: value };
        this.updateAppUserSettingsAsync();
        await this.persistAsync();
    }

    async removeItemAsync(key: string): Promise<void> {
        const localCache = await this.toObjectAsync();
        delete localCache[key];
        this.localCache.state = { ...localCache };
        this.updateAppUserSettingsAsync();
        await this.persistAsync();
    }

    async clearAsync(): Promise<void> {
        localStorage.removeItem(this.baseKey);
        this.localCache.state = {};
        this.updateAppUserSettingsAsync();
    }

    async toObjectAsync(): Promise<LocalCache> {
        if (this.localCache.state === null) {
            const cachedJson = localStorage.getItem(this.baseKey);
            const cachedValue = cachedJson ? JSON.parse<LocalCache>(cachedJson) : {};
            this.localCache.state = cachedValue;
        }

        return this.localCache.state as LocalCache;
    }

    toObject(): LocalCache | null {
        return this.localCache.state;
    }

    private async persistAsync() {
        const json = JSON.stringify(await this.toObjectAsync());
        localStorage.setItem(this.baseKey, json);
    }
}
