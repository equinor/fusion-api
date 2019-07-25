import ReliableDictionary, { LocalStorageProvider } from '../utils/ReliableDictionary';

type NotificationLevel = 'low' | 'medium' | 'high';
type NotificationPriority = 'low' | 'medium' | 'high';
type Notification = {
    level: NotificationLevel;
    priority?: NotificationPriority;
    title: string;
    body?: string | React.FC;
};

type NotificationCache = {
    notifications: Notification[];
};

class NotificationCenter extends ReliableDictionary<NotificationCache> {
    constructor() {
        super(new LocalStorageProvider('NOTIFICATION_CENTER', { notifications: [] }));
    }

    async sendAsync(notification: Notification) {}
}

export default NotificationCenter;
