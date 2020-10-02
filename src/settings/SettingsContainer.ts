import ReliableDictionary, {
    LocalStorageProvider,
    IReadonlyReliableDictionary,
    IReliableDictionary,
} from '../utils/ReliableDictionary';
import AuthUser from '../auth/AuthUser';
import { IEventHub } from '../utils/EventHub';
import AppStorageProvider from './AppStorageProvider';
import UserSettingsClient from '../http/apiClients/UserSettingsClient';

export type Settings = {
    [key: string]: any;
};

export type ReadonlySettings = Readonly<Settings>;

export interface IReadonlySettingsContainer<T> extends IReadonlyReliableDictionary<T> {
    toObjectAsync(): Promise<T>;
}

export interface ISettingsContainer<T = ReadonlySettings>
    extends IReadonlySettingsContainer<T>,
        IReliableDictionary<T> {}

export default class SettingsContainer<T = ReadonlySettings>
    extends ReliableDictionary<T>
    implements ISettingsContainer<T> {
    constructor(
        baseKey: string,
        user: AuthUser | null,
        eventHub: IEventHub,
        defaultSettings?: Settings
    ) {
        super(
            new LocalStorageProvider(
                `FUSION_SETTINGS_CACHE:${baseKey}:${user ? user.id : 'global'}`,
                eventHub,
                defaultSettings
            )
        );
    }
}

export class AppSettingsContainer<T = ReadonlySettings>
    extends ReliableDictionary<T>
    implements ISettingsContainer<T> {
    constructor(
        appKey: string,
        user: AuthUser | null,
        eventHub: IEventHub,
        userSettingsClient: UserSettingsClient,
        defaultSettings?: Settings
    ) {
        super(
            new AppStorageProvider(
                `FUSION_SETTINGS_CACHE:${appKey}:${user ? user.id : 'global'}`,
                eventHub,
                userSettingsClient,
                appKey,
                defaultSettings
            )
        );
    }
    async setAsync<TKey extends keyof T, TValue = T[TKey]>(
        key: TKey,
        value: TValue
    ): Promise<void> {
        const currentValue = await this.getAsync(key);
        const nextValue = { ...currentValue, ...value };
        super.setAsync(key, nextValue);
    }
}
