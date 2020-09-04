import useCoreSettings from '../settings/useCoreSettings';

export enum ComponentDisplayType {
    Comfortable = 'Comfortable',
    Compact = 'Compact',
}

export const useComponentDisplayType = () => {
    const coreSettings = useCoreSettings();
    return coreSettings.componentDisplayType;
};

type ComponentDisplayStyles = {
    comfortable: string;
    compact: string;
};

export const useComponentDisplayClassNames = <T extends ComponentDisplayStyles>(styles: T) => {
    const displayType = useComponentDisplayType();
    return {
        [styles.comfortable]: displayType === ComponentDisplayType.Comfortable,
        [styles.compact]: displayType === ComponentDisplayType.Compact,
    };
};
