import uuid from 'uuid/v1';
import ReliableDictionary, { LocalStorageProvider } from '../utils/ReliableDictionary';
import { useFusionContext } from './FusionContext';

export type NotificationLevel = 'low' | 'medium' | 'high';
export type NotificationPriority = 'low' | 'medium' | 'high';

/**
 * Used when sending a request to send a notification
 */
export type NotificationRequest = {
    /** The level of the notification */
    level: NotificationLevel;
    /**
     * Optional priority of the notification.
     * Used to sort or override other notifications with the same level
     * */
    priority?: NotificationPriority;
    title: string;
    body?: string;
    cancelLabel?: string;
    confirmLabel?: string;
};

export type NotificationResponse = {
    dismissed: boolean;
    confirmed: boolean;
    cancelled: boolean;
};

export type Notification = {
    id: string;
    request: NotificationRequest;
    response: NotificationResponse | null;
    presented: Date;
    responded: Date | null;
    timeout: number | null;
};

type NotificationCache = {
    notifications: Notification[];
};

type NotificationEvents = {
    presented: (notification: NotificationRequest) => void;
    dismissed: (notification: NotificationRequest) => void;
    confirmed: (notification: NotificationRequest) => void;
    cancelled: (notification: NotificationRequest) => void;
    finished: (notification: NotificationRequest) => void;
};

export type NotificationResolver = (response: NotificationResponse) => void;

export type NotificationPresenter = (
    notification: NotificationRequest,
    resolve: (response: NotificationResponse) => void,
    signal: AbortSignal
) => void;

export type NotificationPresenterRegistration = {
    level: NotificationLevel;
    present: NotificationPresenter;
};

export default class NotificationCenter extends ReliableDictionary<NotificationCache, NotificationEvents> {
    private presenters: NotificationPresenterRegistration[] = [];

    constructor() {
        super(new LocalStorageProvider('NOTIFICATION_CENTER', { notifications: [] }));
    }

    async sendAsync(notificationRequest: NotificationRequest): Promise<NotificationResponse> {
        const notification = this.createNotification(notificationRequest);
        await this.persistAsync(notification);

        const response = await this.presentAsync(notification);

        if (response.confirmed) {
            this.emit('confirmed', notificationRequest);
        } else if (response.dismissed) {
            this.emit('dismissed', notificationRequest);
        } else if (response.cancelled) {
            this.emit('cancelled', notificationRequest);
        }

        this.emit('finished', notificationRequest);

        const notificationWithResponse = {
            ...notification,
            responded: new Date(),
            response,
        };

        await this.persistAsync(notificationWithResponse);

        return response;
    }

    registerPresenter(level: NotificationLevel, present: NotificationPresenter) {
        const notificationPresenter = {
            level,
            present,
        };

        this.presenters.push(notificationPresenter);

        return () => {
            const index = this.presenters.indexOf(notificationPresenter);
            this.presenters.splice(index, 1);
        };
    }

    async getAllNotificationsAsync() {
        const notifications = await this.getAsync('notifications');
        return notifications || [];
    }

    private createNotification(notificationRequest: NotificationRequest): Notification {
        return {
            id: uuid(),
            request: notificationRequest,
            response: null,
            presented: new Date(),
            responded: null,
            timeout: this.getTimeoutForLevel(notificationRequest.level),
        };
    }

    private getTimeoutForLevel(level: NotificationLevel): number | null {
        switch (level) {
            case 'low':
                return 4000;
            default:
                return null;
        }
    }

    private async persistAsync(notification: Notification) {
        const notifications = await this.getAllNotificationsAsync();

        const existing = notifications.find(n => n.id === notification.id);

        if (!existing) {
            await this.setAsync('notifications', [...notifications, notification]);
        } else {
            await this.setAsync(
                'notifications',
                notifications.map(n => (n.id === notification.id ? notification : n))
            );
        }
    }

    private presentAsync(notification: Notification): Promise<NotificationResponse> {
        const presenter = this.getPresenter(notification.request);

        if (!presenter) {
            throw new Error('No presenter for notification level ' + notification.request.level);
        }

        const abortController = new AbortController();

        return new Promise<NotificationResponse>((resolve, reject) => {
            // Dismiss the notification after timeout if specified
            if (notification.timeout) {
                setTimeout(() => {
                    abortController.abort();
                }, notification.timeout);
            }

            try {
                presenter.present(notification.request, resolve, abortController.signal);
                this.emit('presented', notification.request);
            } catch (e) {
                reject(e);
            }
        });
    }

    private getPresenter(notification: NotificationRequest) {
        return this.presenters.find(presenter => presenter.level === notification.level);
    }
}

export const useNotificationCenter = () => {
    const { notificationCenter } = useFusionContext();

    return (notificationRequest: NotificationRequest) => notificationCenter.sendAsync(notificationRequest);
};
