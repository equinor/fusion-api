import IReliableDictionaryStorageProvider, {
    ReliableDictionaryStorageProviderEvents,
} from './IReliableDictionaryStorageProvider';
import JSON from '../JSON';
import DistributedState, { IDistributedState } from '../DistributedState';
import { IEventHub } from '../EventHub';
import EventEmitter from '../EventEmitter';

type LocalCache = { [key: string]: any };

export default class LocalStorageProvider
    extends EventEmitter<ReliableDictionaryStorageProviderEvents>
    implements IReliableDictionaryStorageProvider {
    private baseKey: string;
    private localCache: IDistributedState<LocalCache | null>;

    constructor(baseKey: string, eventHub: IEventHub, defaultValue?: LocalCache) {
        super();
        this.baseKey = baseKey;

        const cachedJson = localStorage.getItem(this.baseKey);
        const cachedValue = cachedJson ? JSON.parse<LocalCache>(cachedJson) : null;
        this.localCache = new DistributedState(
            `LocalStorageProvider.${baseKey}`,
            cachedValue,
            eventHub
        );

        if (!cachedValue && defaultValue) {
            this.localCache.state = defaultValue;
        }

        this.localCache.on('change', (value) => {
            this.emit('change', value);
        });
    }

    async getItemAsync<T>(key: string): Promise<T | null> {
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
        await this.persistAsync();
    }

    async removeItemAsync(key: string): Promise<void> {
        const localCache = await this.toObjectAsync();
        delete localCache[key];
        this.localCache.state = { ...localCache };
        await this.persistAsync();
    }

    async clearAsync(): Promise<void> {
        localStorage.removeItem(this.baseKey);
        this.localCache.state = {};
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
