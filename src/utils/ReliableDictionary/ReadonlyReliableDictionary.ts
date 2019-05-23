import IReliableDictionaryStorageProvider, {
    ReadonlyDictionary,
} from "./IReliableDictionaryStorageProvider";

export { default as LocalStorageProvider } from "./LocalStorageProvider";

export interface IReadonlyReliableDictionary {
    getAsync<T>(key: string): Promise<T | null>;
    toObjectAsync(): Promise<ReadonlyDictionary>;
    toObject(): ReadonlyDictionary | null;
}

export default abstract class ReadonlyReliableDictionary {
    protected provider: IReliableDictionaryStorageProvider;

    constructor(provider: IReliableDictionaryStorageProvider) {
        this.provider = provider;
    }

    async getAsync<T>(key: string): Promise<T | null> {
        return await this.provider.getItemAsync(key);
    }

    async toObjectAsync(): Promise<ReadonlyDictionary> {
        return await this.provider.toObjectAsync();
    }

    protected async setAsync<T>(key: string, value: T): Promise<void> {
        await this.provider.setItemAsync(key, value);
    }

    protected async removeAsync(key: string): Promise<void> {
        await this.provider.removeItemAsync(key);
    }

    protected async clearAsync(): Promise<void> {
        await this.provider.clearAsync();
    }
}
