export type PersonNotificationSettings = {
    mail: boolean;
    summaryOnEmail: boolean;
    delay: number;
    appConfig: Array<{
        appKey: string;
        enabled: boolean;
    }>;
};

type test = Pick<PersonNotificationSettings, 'appConfig'>;

export default PersonNotificationSettings;
