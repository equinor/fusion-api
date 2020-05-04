import { PersonNotification } from './PersonNotification';
import { Application } from './Application';

export { PersonNotification, Application as GlobalNotificationApplication };

type GlobalNotification = {
    id: string;
    targetAzureUniqueId: string;
    title: string;
    card: string;
    created: Date;
    createdBy: PersonNotification;
    createdByApplication: Application;
    seenByUser: boolean;
    seen: Date | null;
};

export default GlobalNotification;
