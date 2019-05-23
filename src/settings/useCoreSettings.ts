import { useState, useEffect, useCallback } from "react";
import { useFusionContext } from "../core/FusionContext";
import { ReadonlySettings } from "./SettingsContainer";
import { ComponentDisplayType } from "../core/ComponentDisplayType";

type CoreSettings = {
    componentDisplayType: ComponentDisplayType;
};

const defaultSettings: CoreSettings = {
    componentDisplayType: ComponentDisplayType.Comforable,
};

export default (): CoreSettings => {
    const [coreSettings, setCoreSettings] = useState<CoreSettings>(defaultSettings);
    const { settings } = useFusionContext();

    const setSettings = useCallback((settings: ReadonlySettings) => {
        setCoreSettings(settings as CoreSettings);
    }, []);

    useEffect(() => {
        settings.core.toObjectAsync().then(setSettings);

        return settings.core.on("change", setSettings);
    }, []);

    return coreSettings;
};
