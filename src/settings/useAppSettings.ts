import { useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { useFusionContext } from '../core/FusionContext';
import { useCurrentApp } from '../app/AppContainer';
import { AppSettingsContainer, ReadonlySettings } from './SettingsContainer';
import EventHub from '../utils/EventHub';
import useApiClients from '../http/hooks/useApiClients';
import { useCurrentContext } from '../core/ContextManager';
import UserSettingsClient from '../http/apiClients/UserSettingsClient';

type SetAppSetting = <T>(key: string, value: T) => void;
type AppSettingsHook<T> = [T, SetAppSetting];

export const useSettingSelector = <T extends ReadonlySettings, K>(
    selector: (state: T) => K | null,
    state: T
): K | null => {
    const [userSettings, setUserSettings] = useState<K | null>(null);

    useLayoutEffect(() => {
        const nextValue = selector(state);
        if (nextValue !== userSettings) {
            setUserSettings(nextValue);
        }
    }, [selector, state, userSettings]);

    return userSettings;
};

const ensureAppSettings = <T extends ReadonlySettings, K extends ReadonlySettings>(
    settings: T,
    appKey: string,
    userSettingsClient: UserSettingsClient,
    defaultSettings?: K
) => {
    if (typeof settings.apps[appKey] === 'undefined') {
        const appSettings = new AppSettingsContainer(
            appKey,
            new EventHub(),
            userSettingsClient,
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
    const { userSettings } = useApiClients();

    const appSettings = ensureAppSettings(
        settings,
        currentApp ? currentApp.key : '',
        userSettings,
        defaultSettings
    );

    const [localAppSettings, setLocalAppSettings] = useState(appSettings.toObject() || {});

    useEffect(() => {
        appSettings.toObjectAsync().then(setLocalAppSettings);

        return appSettings.on('change', setLocalAppSettings);
    }, []);

    const setAppSettingAsync: SetAppSetting = async <T>(key: string, value: T): Promise<void> => {
        await appSettings.setAsync(key, value);
        const obj = await appSettings.toObjectAsync();
        setLocalAppSettings(obj);
    };

    return [localAppSettings, setAppSettingAsync];
};

type ContextSetting<T> = {
    [contextId: string]: T | undefined;
};

type AppContextSetting<T> = {
    context: ContextSetting<T>;
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
    const contextId = useMemo(
        () => context || currentContext?.id || 'global',
        [currentContext, context]
    );

    const [appSettings, setAppSettings] = useAppSettings<AppContextSetting<T>>({
        context: {
            [contextId]: defaultSettings,
        },
    });

    const selector = (state: AppContextSetting<T>) => state?.context?.[contextId] || null;

    const contextSettings = useSettingSelector<AppContextSetting<T>, T>(selector, appSettings);

    const setContextSetting = useCallback(
        (value: T) => {
            setAppSettings('context', { ...appSettings.context, [contextId]: value });
        },
        [contextId, appSettings]
    );

    return [contextSettings, setContextSetting];
};

export default useAppSettings;
