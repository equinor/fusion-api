import { useState, useEffect } from "react";
import { useFusionContext } from "../core/FusionContext";
import { ReadonlySettings } from "./SettingsContainer";

export default (): ReadonlySettings => {
    const [coreSettings, setCoreSettings] = useState<ReadonlySettings>({});
    const { settings } = useFusionContext();

    useEffect(() => {
        settings.core.toObjectAsync().then(setCoreSettings);

        return settings.core.on("change", setCoreSettings);
    }, []);

    return coreSettings;
};
