import { IEventHub } from '../utils/EventHub';

import UserSettingsClient from '../http/apiClients/UserSettingsClient';
import EventEmitter from '../utils/EventEmitter';
import JSON from '../utils/JSON';
import DistributedState, { IDistributedState } from '../utils/DistributedState';
import IReliableDictionaryStorageProvider, {
    ReliableDictionaryStorageProviderEvents,
} from '../utils/ReliableDictionary/IReliableDictionaryStorageProvider';
import { Settings } from './SettingsContainer';

export default class AppStorageProvider<T extends Settings = any>
    extends EventEmitter<ReliableDictionaryStorageProviderEvents>
    implements IReliableDictionaryStorageProvider {
    private appKey: string;
    private baseKey: string;
    private userSettingsClient: UserSettingsClient;
    public isInitialized = false;
    private initializing: Promise<void>;
    private localCache: IDistributedState<T | null>;

    constructor(
        baseKey: string,
        eventHub: IEventHub,
        userSettingsClient: UserSettingsClient,
        appKey: string,
        defaultSettings?: T
    ) {
        super();
        this.appKey = appKey;
        this.baseKey = baseKey;
        const cachedJson = localStorage.getItem(this.baseKey);
        const cachedValue = cachedJson ? JSON.parse<T>(cachedJson) : null;
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
        this.initializing = new Promise((resolve, reject) =>
            this.initialize()
                .then(() => resolve())
                .catch((e) => reject(e))
        );
    }
    private async initialize() {
        try {
            const response = await this.userSettingsClient.getAppUserSettings(this.appKey);
            this.localCache.state = response.data;
            await this.persistAsync();
            this.isInitialized = true;
        } catch (e) {
            this.isInitialized = false;
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
            try {
                await this.initializing;
            } catch (e) {
                return null;
            }
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
        this.localCache.state = {} as T;
        this.updateAppUserSettingsAsync();
    }

    async toObjectAsync(): Promise<T> {
        if (this.localCache.state === null) {
            const cachedJson = localStorage.getItem(this.baseKey);
            const cachedValue = cachedJson ? JSON.parse<T>(cachedJson) : ({} as T);
            this.localCache.state = cachedValue;
        }

        return this.localCache.state as T;
    }

    toObject(): T | null {
        return this.localCache.state;
    }

    private async persistAsync() {
        const json = JSON.stringify(await this.toObjectAsync());
        localStorage.setItem(this.baseKey, json);
    }
}
