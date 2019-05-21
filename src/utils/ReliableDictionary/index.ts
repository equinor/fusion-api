import IReliableDictionaryStorageProvider, { ReadonlyDictionary } from "./IReliableDictionaryStorageProvider";
import { IReadonlyReliableDictionary } from "./ReadonlyReliableDictionary";
import EventEmitter from "../EventEmitter";

export { default as LocalStorageProvider } from "./LocalStorageProvider";
export { default as ReadOnlyReliableDictionary } from "./ReadonlyReliableDictionary";

export { IReadonlyReliableDictionary };

export interface IReliableDictionary extends IReadonlyReliableDictionary {
    setAsync<T>(key: string, value: T): Promise<void>;

    removeAsync(key: string): Promise<void>;

    clearAsync(): Promise<void>;
}

type ReliableDictionaryEvents = {
    change: (dictionary: ReadonlyDictionary) => void;
}

export default abstract class ReliableDictionary extends EventEmitter<ReliableDictionaryEvents> implements IReliableDictionary {
    protected provider: IReliableDictionaryStorageProvider;
    
    constructor(provider: IReliableDictionaryStorageProvider) {
        super();
        this.provider = provider;
    }
    
    async getAsync<T>(key: string): Promise<T | null> {
        return await this.provider.getItemAsync(key);
    }
    
    async setAsync<T>(key: string, value: T): Promise<void> {
        await this.provider.setItemAsync(key, value);
        await this.emitChangesAsync();
    }
    
    async removeAsync(key: string): Promise<void> {
        await this.provider.removeItemAsync(key);
        await this.emitChangesAsync();
    }
    
    async clearAsync(): Promise<void> {
        await this.provider.clearAsync();
        await this.emitChangesAsync();
    }

    async toObjectAsync(): Promise<ReadonlyDictionary> {
        return await this.provider.toObjectAsync();
    }

    private async emitChangesAsync(): Promise<void> {
        const dictionary = await this.toObjectAsync();
        this.emit("change", dictionary);
    }
}
