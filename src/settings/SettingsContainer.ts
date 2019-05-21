import ReliableDictionary, {
    LocalStorageProvider,
    IReadonlyReliableDictionary,
    IReliableDictionary,
} from "../utils/ReliableDictionary";

type Settings = {
    [key: string]: any;
};

export type ReadonlySettings = Readonly<Settings>;

export interface IReadonlySettingsContainer extends IReadonlyReliableDictionary {
    toObjectAsync(): Promise<ReadonlySettings>;
}

export interface ISettingsContainer extends IReadonlySettingsContainer, IReliableDictionary {}

export default class SettingsContainer extends ReliableDictionary implements ISettingsContainer {
    constructor(baseKey: string) {
        super(new LocalStorageProvider(`FUSION_SETTINGS_CACHE:${baseKey}`));
    }

    async toObjectAsync(): Promise<ReadonlySettings> {
        const value = await this.provider.toObjectAsync();
        return value;
    }
}
