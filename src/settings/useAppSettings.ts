import { useState, useEffect } from "react";
import { useFusionContext, Settings } from "../core/FusionContext";
import { useAppContext } from "../app/AppContext";
import SettingsContainer, { ReadonlySettings } from "./SettingsContainer";
import useCurrentUser from '../auth/useCurrentUser';

type SetAppSetting = <T>(key: string, value: T) => void;
type AppSettingsHook = [ReadonlySettings, SetAppSetting];

const ensureAppSettings = (settings: Settings, appKey: string, defaultSettings?: ReadonlySettings) => {
    const currentUser = useCurrentUser();
    
    if (typeof settings.apps[appKey] === "undefined") {
        const appSettings = new SettingsContainer(appKey, currentUser, defaultSettings);
        settings.apps[appKey] = appSettings;
        return appSettings;
    }

    return settings.apps[appKey];
};

export default (defaultSettings?: ReadonlySettings): AppSettingsHook => {
    const { settings } = useFusionContext();
    const { appKey } = useAppContext();

    let appSettings = ensureAppSettings(settings, appKey);

    const [localAppSettings, setLocalAppsettings] = useState<ReadonlySettings>(appSettings.toObject() || {});

    useEffect(() => {
        appSettings.toObjectAsync().then(setLocalAppsettings);

        return appSettings.on("change", setLocalAppsettings);
    }, []);

    const setAppSettingAsync: SetAppSetting = async <T>(key: string, value: T): Promise<void> => {
        await appSettings.setAsync(key, value);
        const obj = await appSettings.toObjectAsync();
        setLocalAppsettings(obj);
    };

    return [localAppSettings, setAppSettingAsync];
};
