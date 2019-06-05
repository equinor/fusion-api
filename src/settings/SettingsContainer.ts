import ReliableDictionary, {
    LocalStorageProvider,
    IReadonlyReliableDictionary,
    IReliableDictionary,
} from "../utils/ReliableDictionary";

type Settings = {
    [key: string]: any;
};

export type ReadonlySettings = Readonly<Settings>;

export interface IReadonlySettingsContainer<T> extends IReadonlyReliableDictionary<T> {
    toObjectAsync(): Promise<T>;
}

export interface ISettingsContainer<T = ReadonlySettings>  extends IReadonlySettingsContainer<T>, IReliableDictionary<T> {}

export default class SettingsContainer<T = ReadonlySettings> extends ReliableDictionary<T>
    implements ISettingsContainer<T> {
    constructor(baseKey: string, defaultSettings?: Settings) {
        super(new LocalStorageProvider(`FUSION_SETTINGS_CACHE:${baseKey}`, defaultSettings));
    }
}
