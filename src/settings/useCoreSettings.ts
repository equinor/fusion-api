import { useState, useEffect, useCallback } from "react";
import { useFusionContext, CoreSettings, defaultSettings } from "../core/FusionContext";
import { ReadonlySettings } from "./SettingsContainer";


export default (): CoreSettings => {
    const { settings } = useFusionContext();
    const [coreSettings, setCoreSettings] = useState<CoreSettings>((settings.core.toObject() as CoreSettings) || defaultSettings);

    const setSettings = useCallback((settings: ReadonlySettings) => {
        setCoreSettings(settings as CoreSettings);
    }, []);

    useEffect(() => {
        settings.core.toObjectAsync().then(setSettings);

        return settings.core.on("change", setSettings);
    }, []);

    return coreSettings;
};
