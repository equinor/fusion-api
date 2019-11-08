import { useState, useEffect } from 'react';
import { useFusionContext, Settings } from '../core/FusionContext';
import { useCurrentApp } from '../app/AppContainer';
import SettingsContainer, { ReadonlySettings } from './SettingsContainer';
import useCurrentUser from '../auth/useCurrentUser';
import EventHub from '../utils/EventHub';

type SetAppSetting = <T>(key: string, value: T) => void;
type AppSettingsHook = [ReadonlySettings, SetAppSetting];

const ensureAppSettings = (
    settings: Settings,
    appKey: string,
    defaultSettings?: ReadonlySettings
) => {
    const currentUser = useCurrentUser();

    if (typeof settings.apps[appKey] === 'undefined') {
        const appSettings = new SettingsContainer(
            appKey,
            currentUser,
            new EventHub(),
            defaultSettings
        );
        settings.apps[appKey] = appSettings;
        return appSettings;
    }

    return settings.apps[appKey];
};

export default (defaultSettings?: ReadonlySettings): AppSettingsHook => {
    const { settings } = useFusionContext();
    const currentApp = useCurrentApp();

    let appSettings = ensureAppSettings(settings, currentApp ? currentApp.key : '');

    const [localAppSettings, setLocalAppsettings] = useState<ReadonlySettings>(
        appSettings.toObject() || {}
    );

    useEffect(() => {
        appSettings.toObjectAsync().then(setLocalAppsettings);

        return appSettings.on('change', setLocalAppsettings);
    }, []);

    const setAppSettingAsync: SetAppSetting = async <T>(key: string, value: T): Promise<void> => {
        await appSettings.setAsync(key, value);
        const obj = await appSettings.toObjectAsync();
        setLocalAppsettings(obj);
    };

    return [localAppSettings, setAppSettingAsync];
};
