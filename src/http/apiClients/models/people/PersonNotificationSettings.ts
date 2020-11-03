export type PersonNotificationSettings = {
    email: boolean;
    delayInMinutes: number;
    appConfig: Array<{
        appKey: string;
        enabled: boolean;
    }>;
};

export default PersonNotificationSettings;
