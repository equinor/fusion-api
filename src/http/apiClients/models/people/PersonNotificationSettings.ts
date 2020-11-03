export type PersonNotificationSettings = {
    email: boolean;
    delayInMinutes: number;
    appConfig: Array<{
        appKey: string;
        enabled: boolean;
    }>;
};

type test = Pick<PersonNotificationSettings, 'appConfig'>;

export default PersonNotificationSettings;
