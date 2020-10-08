import { useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { useFusionContext } from '../core/FusionContext';
import { useCurrentApp } from '../app/AppContainer';
import { AppSettingsContainer, ReadonlySettings } from './SettingsContainer';
import useCurrentUser from '../auth/useCurrentUser';
import EventHub from '../utils/EventHub';
import useApiClients from '../http/hooks/useApiClients';
import { useCurrentContext } from '../core/ContextManager';

type SetAppSetting = <T>(key: string, value: T) => void;
type AppSettingsHook<T> = [T, SetAppSetting];

export const useSettingSelector = <T extends ReadonlySettings, K extends any>(
    selector: (state: T) => K,
    state: T
): K | null => {
    const [userSettings, setUserSettings] = useState<K | null>(null);

    useLayoutEffect(() => {
        const nextValue = selector(state);
        if (nextValue !== userSettings) {
            setUserSettings(nextValue);
        }
    }, [selector]);

    return userSettings;
};

const ensureAppSettings = <T extends ReadonlySettings, K extends ReadonlySettings>(
    settings: T,
    appKey: string,
    defaultSettings?: K
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
/**
 * The useAppSettings will create and store app setting for different apps. The settings
 * will also be stored backend for redundancy
 * @param defaultSettings Provide default settings
 * @returns A state and a state setter, use these to get and update app settings.
 * @example
 * type ExampleSetting = { isExample: boolean };
 *
 * const defaultExampleSetting: ExampleSetting = { isExample: false };
 *
 * const [appSettings, setAppSettings] = useAppSettings<ExampleSetting>(defaultExampleSetting);
 *
 * const setOrgFilterSettings = (exampleSettings: ExampleSetting) => {
 *   setAppSettings('isExample', exampleSettings);
 * };
 */
const useAppSettings = <T extends ReadonlySettings>(
    defaultSettings?: T
): AppSettingsHook<Readonly<T>> => {
    const { settings } = useFusionContext();
    const currentApp = useCurrentApp();

    const appSettings = ensureAppSettings(
        settings,
        currentApp ? currentApp.key : '',
        defaultSettings
    );

    const [localAppSettings, setLocalAppsettings] = useState(appSettings.toObject() || {});

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

/**
 * The useContextSettingsSelector will create app settings for every context.
 * @param context Use a custom context string, otherwise the fusion context id will be used
 * @param defaultSettings Provide default settings
 * @returns A state and a state setter, use these to get app settings for the context and update app settings.
 * @example type ExampleSetting = { isExample: boolean }
 *
 *  const defaultExampleSetting: ExampleSetting = { isExample: false};
 *
 *  const contextId = useAppContextId();
 *
 *  const [exampleSettings, setExampleSettings] = useAppContextSettings<ExampleSetting>(contextId, defaultExampleSetting);
 *
 *  const updateExampleSettings = () => setExampleSettings({ isExample: true })
 *
 *  updateExampleSettings();
 */

export const useAppContextSettings = <T extends ReadonlySettings>(
    context?: string,
    defaultSettings?: T
): [T | null, (settings: T) => void] => {
    const currentContext = useCurrentContext();
    const contextId = useMemo(() => context || currentContext?.id || 'global', [
        currentContext,
        context,
    ]);

    const [appSettings, setAppSettings] = useAppSettings<T>(defaultSettings);

    const selector = (state: any) => state?.context?.[contextId] || '';

    const contextSettings = useSettingSelector(selector, appSettings);

    const setContextSetting = useCallback(
        (value: T) => {
            setAppSettings('context', { ...appSettings.context, [contextId]: value });
        },
        [contextId, appSettings]
    );

    return [contextSettings, setContextSetting];
};

export default useAppSettings;
