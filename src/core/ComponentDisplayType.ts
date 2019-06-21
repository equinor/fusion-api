import useCoreSettings from "../settings/useCoreSettings";

export enum ComponentDisplayType {
    Comfortable = "Comfortable",
    Compact = "Compact",
}

export const useComponentDisplayType = () => {
    const coreSettings = useCoreSettings();
    return coreSettings.componentDisplayType;
};
