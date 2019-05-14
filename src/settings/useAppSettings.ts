import { useState } from "react";
import { useFusionContext } from "../core/FusionContext";
import { useAppContext } from "../app/AppContext";
import SettingsContainer, { ReadOnlySettings } from "./SettingsContainer";

type SetAppSetting = <T>(key: string, value: T) => void;
type AppSettingsHook = [ReadOnlySettings, SetAppSetting];

export default (): AppSettingsHook => {
    const { settings } = useFusionContext();
    const { appKey } = useAppContext();

    let appSettings = settings.apps[appKey];

    if (typeof appSettings === "undefined") {
        appSettings = SettingsContainer.createFromCache(appKey);
        settings.apps[appKey] = appSettings;
    }

    const [localAppSettings, setLocalAppsettings] = useState(
        appSettings.toObject()
    );

    const setAppSetting: SetAppSetting = <T>(key: string, value: T): void => {
        appSettings.set(key, value);
        setLocalAppsettings(appSettings.toObject());
    };

    return [localAppSettings, setAppSetting];
};
