import IReliableDictionaryStorageProvider, {
    ReadonlyDictionary,
} from './IReliableDictionaryStorageProvider';
import { IReadonlyReliableDictionary } from './ReadonlyReliableDictionary';
import EventEmitter, { Events } from '../EventEmitter';

export { default as LocalStorageProvider } from './LocalStorageProvider';
export { default as ReadOnlyReliableDictionary } from './ReadonlyReliableDictionary';

export { IReadonlyReliableDictionary };

export interface IReliableDictionary<TCacheType> extends IReadonlyReliableDictionary<TCacheType> {
    setAsync<TKey extends keyof TCacheType>(key: TKey, value: TCacheType[TKey]): Promise<void>;

    removeAsync<TKey extends keyof TCacheType>(key: TKey): Promise<void>;

    clearAsync(): Promise<void>;
}

type ReliableDictionaryEvents<TCacheType> = {
    change: (dictionary: TCacheType) => void;
};

type AdditionalEvents = Record<string, any>;

export default abstract class ReliableDictionary<
        TCacheType = ReadonlyDictionary,
        TAdditionalEvents extends Events = AdditionalEvents,
        TEvents extends Events = ReliableDictionaryEvents<TCacheType> & TAdditionalEvents
    >
    extends EventEmitter<TEvents>
    implements IReliableDictionary<TCacheType> {
    protected provider: IReliableDictionaryStorageProvider;

    constructor(provider: IReliableDictionaryStorageProvider) {
        super();
        this.provider = provider;
        this.provider.on('change', (value) => {
            this.emit('change', value);
        });
    }

    async getAsync<TKey extends keyof TCacheType, T = TCacheType[TKey]>(
        key: TKey
    ): Promise<T | null> {
        return (await this.provider.getItemAsync(key.toString())) as T;
    }

    async setAsync<TKey extends keyof TCacheType, T = TCacheType[TKey]>(
        key: TKey,
        value: T
    ): Promise<void> {
        await this.provider.setItemAsync(key.toString(), value);
        await this.emitChangesAsync();
    }

    async removeAsync<TKey extends keyof TCacheType>(key: TKey): Promise<void> {
        await this.provider.removeItemAsync(key.toString());
        await this.emitChangesAsync();
    }

    async clearAsync(): Promise<void> {
        await this.provider.clearAsync();
        await this.emitChangesAsync();
    }

    async toObjectAsync(): Promise<TCacheType> {
        const value = await this.provider.toObjectAsync();
        return value as TCacheType;
    }

    toObject(): TCacheType | null {
        return this.provider.toObject() as TCacheType;
    }

    protected async emitChangesAsync(): Promise<void> {
        const dictionary = await this.toObjectAsync();
        this.emit('change', dictionary);
    }
}
