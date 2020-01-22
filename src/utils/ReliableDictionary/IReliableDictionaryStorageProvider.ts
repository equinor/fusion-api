import { IEventEmitter } from '../EventEmitter';

export type Dictionary = { [key: string]: any };
export type ReadonlyDictionary = Readonly<Dictionary>;

export type ReliableDictionaryStorageProviderEvents = {
    change: (dictionary: ReadonlyDictionary) => void;
};
export default interface IReliableDictionaryStorageProvider
    extends IEventEmitter<ReliableDictionaryStorageProviderEvents> {
    getItemAsync<T>(key: string): Promise<T | null>;
    setItemAsync<T>(key: string, value: T): Promise<void>;
    removeItemAsync(key: string): Promise<void>;
    clearAsync(): Promise<void>;
    toObjectAsync(): Promise<ReadonlyDictionary>;
    toObject(): ReadonlyDictionary | null;
}
