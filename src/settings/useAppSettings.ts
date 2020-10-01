import { useState, useEffect } from 'react';
import { useFusionContext, Settings } from '../core/FusionContext';
import { useCurrentApp } from '../app/AppContainer';
import { AppSettingsContainer, ReadonlySettings } from './SettingsContainer';
import useCurrentUser from '../auth/useCurrentUser';
import EventHub from '../utils/EventHub';
import useApiClients from '../http/hooks/useApiClients';

type SetAppSetting = <T>(key: string, value: T) => void;
type AppSettingsHook = [ReadonlySettings, SetAppSetting];

const ensureAppSettings = (
    settings: Settings,
    appKey: string,
    defaultSettings?: ReadonlySettings
) => {
    const currentUser = useCurrentUser();
    const { userSettings } = useApiClients();

    if (typeof settings.apps[appKey] === 'undefined') {
        const appSettings = new AppSettingsContainer(
            appKey,
            currentUser,
            new EventHub(),
            userSettings,
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

    const appSettings = ensureAppSettings(settings, currentApp ? currentApp.key : '');

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
