import { useState, useEffect } from "react";
import { useFusionContext, CoreSettings, defaultSettings } from "../core/FusionContext";


export default (): CoreSettings => {
    const { settings } = useFusionContext();
    const [coreSettings, setCoreSettings] = useState<CoreSettings>(settings.core.toObject() || defaultSettings);

    useEffect(() => {
        settings.core.toObjectAsync().then(setCoreSettings);

        return settings.core.on("change", setCoreSettings);
    }, [setCoreSettings]);

    return coreSettings;
};
