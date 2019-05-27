import IReliableDictionaryStorageProvider from "./IReliableDictionaryStorageProvider";

type LocalCache = { [key: string]: any };

export default class LocalStorageProvider implements IReliableDictionaryStorageProvider {
    private baseKey: string;
    private localCache: LocalCache | null = null;

    constructor(baseKey: string, defaultValue?: LocalCache) {
        this.baseKey = baseKey;
        
        if(defaultValue) {
            this.localCache = defaultValue;
        }
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
        localCache[key] = value;
        await this.persistAsync();
    }

    async removeItemAsync(key: string): Promise<void> {
        const localCache = await this.toObjectAsync();
        delete localCache[key];
        await this.persistAsync();
    }

    async clearAsync(): Promise<void> {
        localStorage.removeItem(this.baseKey);
    }

    async toObjectAsync(): Promise<LocalCache> {
        if (this.localCache === null) {
            const cachedJson = localStorage.getItem(this.baseKey);
            const cachedValue = cachedJson ? JSON.parse(cachedJson) : {};
            this.localCache = cachedValue;
        }

        return this.localCache as LocalCache;
    }

    toObject(): LocalCache | null {
        return this.localCache;
    }

    private async persistAsync() {
        const json = JSON.stringify(await this.toObjectAsync());
        localStorage.setItem(this.baseKey, json);
    }
}
