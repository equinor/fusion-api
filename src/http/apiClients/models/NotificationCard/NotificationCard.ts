import { PersonNotification } from './PersonNotification';
import { Application } from './Application';

export { PersonNotification, Application as NotificationCardApplication };

type NotificationCard = {
    id: string;
    targetAzureUniqueId: string;
    title: string;
    card: Record<string, unknown>;
    created: Date;
    createdBy: PersonNotification;
    createdByApplication: Application;
    seenByUser: boolean;
    seen: Date | null;
};

export default NotificationCard;
