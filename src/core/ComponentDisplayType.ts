import useCoreSettings from "../settings/useCoreSettings";

export enum ComponentDisplayType {
    Comforable = "Comforable",
    Compact = "Compact",
}

export const useComponentDisplayType = () => {
    const coreSettings = useCoreSettings();
    return coreSettings.componentDisplayType;
};
