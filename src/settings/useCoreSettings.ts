import { useFusionContext } from "../core/FusionContext";
import { ReadOnlySettings } from "./SettingsContainer";

export default (): ReadOnlySettings => {
    const { settings } = useFusionContext();
    return settings.core.toObject();
};
