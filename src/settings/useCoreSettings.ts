import { useState, useEffect, useCallback } from "react";
import { useFusionContext, CoreSettings, defaultSettings } from "../core/FusionContext";


export default (): CoreSettings => {
    const { settings } = useFusionContext();
    const [coreSettings, setCoreSettings] = useState<CoreSettings>(settings.core.toObject() || defaultSettings);

    const setSettings = useCallback((settings: CoreSettings) => {
        setCoreSettings(settings);
    }, []);

    useEffect(() => {
        settings.core.toObjectAsync().then(setSettings);

        return settings.core.on("change", setSettings);
    }, []);

    return coreSettings;
};
