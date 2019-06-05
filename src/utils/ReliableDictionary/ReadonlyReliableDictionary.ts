import IReliableDictionaryStorageProvider, {
    ReadonlyDictionary,
} from "./IReliableDictionaryStorageProvider";

export { default as LocalStorageProvider } from "./LocalStorageProvider";

export interface IReadonlyReliableDictionary<TCacheType> {
    getAsync<TKey extends keyof TCacheType, T>(key: TKey): Promise<T | null>;
    toObjectAsync(): Promise<TCacheType>;
    toObject(): TCacheType | null;
}

export default abstract class ReadonlyReliableDictionary<TCacheType = ReadonlyDictionary> {
    protected provider: IReliableDictionaryStorageProvider;

    constructor(provider: IReliableDictionaryStorageProvider) {
        this.provider = provider;
    }

    async getAsync<TKey extends keyof TCacheType, T>(key: TKey): Promise<T | null> {
        return await this.provider.getItemAsync(key.toString());
    }

    async toObjectAsync(): Promise<TCacheType> {
        const value = await this.provider.toObjectAsync();
        return value as TCacheType;
    }

    protected async setAsync<TKey extends keyof TCacheType, T = TCacheType[TKey]>(key: TKey, value: T): Promise<void> {
        await this.provider.setItemAsync(key.toString(), value);
    }

    protected async removeAsync<TKey extends keyof TCacheType>(key: TKey): Promise<void> {
        await this.provider.removeItemAsync(key.toString());
    }

    protected async clearAsync(): Promise<void> {
        await this.provider.clearAsync();
    }
}
