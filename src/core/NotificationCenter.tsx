import React, { useState, useEffect, ReactNode } from 'react';
import { v1 as uuidv1 } from 'uuid';
import ReliableDictionary, { LocalStorageProvider } from '../utils/ReliableDictionary';
import { useEventEmitterValue } from '../utils/EventEmitter';
import { useFusionContext } from './FusionContext';
import DistributedState, { IDistributedState } from '../utils/DistributedState';
import EventHub, { IEventHub } from '../utils/EventHub';
import ApiClients from '../http/apiClients';
import NotificationClient from '../http/apiClients/NotificationClient';
import NotificationCard from '../http/apiClients/models/NotificationCard/NotificationCard';
import useSignalRHub from '../hooks/useSignalRHub';

export type NotificationLevel = 'low' | 'medium' | 'high';
export type NotificationPriority = 'low' | 'medium' | 'high';

/**
 * Used when sending a request to send a notification
 */
export type NotificationRequest = {
    /* Optional notification id. Notifications with a unique id will only be shown to the user once. Ever. */
    id?: string;
    /** The level of the notification */
    level: NotificationLevel;
    /**
     * Optional priority of the notification.
     * Used to sort or override other notifications with the same level
     * */
    priority?: NotificationPriority;
    title: string;
    body?: ReactNode;
    cancelLabel?: string;
    confirmLabel?: string;
    hideCancelAction?: boolean;

    /**
     * How long should the notification be visible to the user?
     * Only applicable for notifications with level == 'low'.
     * Min-max: 4000-10000 ms
     */
    timeout?: number;
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

export type RegisterNotificationPresenter = (
    level: NotificationLevel,
    present: NotificationPresenter
) => () => void;

export interface INotificationContext {
    presenters: NotificationPresenterRegistration[];
    registerPresenter: RegisterNotificationPresenter;
    cardPresenter: NotificationCardPresenterRegistration;
    registerCardPresenter: RegisterNotificationCardPresenter;
}

type NotificationCache = {
    notifications: Notification[];
};

type NotificationEvents = {
    presented: (notification: NotificationRequest) => void;
    dismissed: (notification: NotificationRequest) => void;
    confirmed: (notification: NotificationRequest) => void;
    cancelled: (notification: NotificationRequest) => void;
    finished: (notification: NotificationRequest) => void;
    'notification-cards-updated': (notificationCards: NotificationCard[]) => void;
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

type NotificationCardPresenter = (notificationCard: NotificationCard) => void;

type NotificationCardPresenterRegistration = {
    present: NotificationCardPresenter;
} | null;

export type RegisterNotificationCardPresenter = (present: NotificationCardPresenter) => () => void;

export default class NotificationCenter extends ReliableDictionary<
    NotificationCache,
    NotificationEvents
> {
    private presenters: IDistributedState<NotificationPresenterRegistration[]>;
    private cardPresenter: IDistributedState<NotificationCardPresenterRegistration>;
    private notificationCards: IDistributedState<NotificationCard[]>;
    private notificationClient: NotificationClient;

    constructor(eventHub: IEventHub, apiClients: ApiClients) {
        super(
            new LocalStorageProvider('NOTIFICATION_CENTER', new EventHub(), { notifications: [] })
        );
        this.notificationCards = new DistributedState<NotificationCard[]>(
            'NotificationCenter.NotificationCards',
            [],
            eventHub
        );

        this.presenters = new DistributedState<NotificationPresenterRegistration[]>(
            'NotificationCenter.presenters',
            [],
            eventHub
        );
        this.cardPresenter = new DistributedState<NotificationCardPresenterRegistration>(
            'NotificationCenter.cardPresenter',
            null,
            eventHub
        );
        this.notificationClient = apiClients.notification;
    }

    async sendAsync(
        notificationRequest: NotificationRequest,
        notificationContext?: INotificationContext
    ): Promise<NotificationResponse> {
        if (!(await this.shouldPresentNotificationAsync(notificationRequest))) {
            return Promise.reject();
        }

        const notification = this.createNotification(notificationRequest);
        await this.persistAsync(notification);

        const response = await this.presentAsync(notification, notificationContext);

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

    sendCard(
        notificationCard: NotificationCard,
        notificationContext?: INotificationContext,
        silent?: boolean
    ) {
        this.mergeNotificationCards([notificationCard]);
        !silent && this.presentCardAsync(notificationCard, notificationContext);
    }

    presentCardAsync(notification: NotificationCard, notificationContext?: INotificationContext) {
        const presenter = this.getCardPresenter(notificationContext);
        if (!presenter) {
            throw new Error('No presenter for notification cards ');
        }
        presenter.present(notification);
    }

    async getNotificationCardsAsync(filter?: string) {
        const response = await this.notificationClient.getPersonNotificationsAsync('me', filter);
        this.mergeNotificationCards(response.data.value);
        return response.data.value;
    }

    private mergeNotificationCards(cards: NotificationCard[]) {
        const newNotificationCards = cards.filter(
            (t) => !this.notificationCards.state.find((e) => e.id === t.id)
        );

        const mergedNotificationCards = [...this.notificationCards.state, ...newNotificationCards];

        this.notificationCards.state = mergedNotificationCards.map(
            (c) => cards.find((n) => n.id === c.id) || c
        );
        this.emit('notification-cards-updated', this.notificationCards.state);
    }

    private deleteNotificationCards(cards: NotificationCard[]) {
        this.notificationCards.state = [...this.notificationCards.state].filter(
            (c) => !cards.some((deletedCard) => deletedCard.id === c.id)
        );
        this.emit('notification-cards-updated', this.notificationCards.state);
    }

    getNotificationCards() {
        return [...this.notificationCards.state];
    }

    registerCardPresenter(present: NotificationCardPresenter) {
        const notificationPresenter = {
            present,
        };
        this.cardPresenter.state = notificationPresenter;
        return () => {
            this.cardPresenter.state = null;
        };
    }

    async markNotificationCardAsSeenAsync(notificationCard: NotificationCard) {
        const payload = {
            seenByUser: true,
        };
        const response = await this.notificationClient.updateNotificationAsync(
            notificationCard.id,
            payload
        );
        this.mergeNotificationCards([response.data]);
        return response.data;
    }
    async deleteNotificationCardAsync(notificationCard: NotificationCard) {
        await this.notificationClient.deleteNotificationAsync(notificationCard.id);
        this.deleteNotificationCards([notificationCard]);
        return;
    }

    registerPresenter(level: NotificationLevel, present: NotificationPresenter) {
        const notificationPresenter = {
            level,
            present,
        };
        this.presenters.state = [...this.presenters.state, notificationPresenter];

        return () => {
            this.presenters.state = this.presenters.state.filter(
                (p) => p !== notificationPresenter
            );
        };
    }

    async getAllNotificationsAsync() {
        const notifications = await this.getAsync('notifications');
        return notifications || [];
    }

    private async shouldPresentNotificationAsync(notificationRequest: NotificationRequest) {
        const allNotifications = await this.getAllNotificationsAsync();

        if (allNotifications.find((n) => n.responded !== null && n.id === notificationRequest.id)) {
            return false;
        }

        return true;
    }

    private createNotification(notificationRequest: NotificationRequest): Notification {
        return {
            id: notificationRequest.id || uuidv1(),
            request: notificationRequest,
            response: null,
            presented: new Date(),
            responded: null,
            timeout: this.getTimeoutForLevel(notificationRequest),
        };
    }

    private getTimeoutForLevel(notificationRequest: NotificationRequest): number | null {
        switch (notificationRequest.level) {
            case 'low':
                return notificationRequest.timeout
                    ? Math.max(4000, Math.min(10000, notificationRequest.timeout))
                    : 4000;
            default:
                return null;
        }
    }

    private async persistAsync(notification: Notification) {
        if (notification.request.level === 'low') {
            return;
        }

        const notifications = await this.getAllNotificationsAsync();

        const existing = notifications.find((n) => n.id === notification.id);

        if (!existing) {
            await this.setAsync('notifications', [...notifications, notification]);
        } else {
            await this.setAsync(
                'notifications',
                notifications.map((n) => (n.id === notification.id ? notification : n))
            );
        }
    }

    private presentAsync(
        notification: Notification,
        notificationContext?: INotificationContext
    ): Promise<NotificationResponse> {
        const presenter = this.getPresenter(notification.request, notificationContext);

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

    private getCardPresenter(notificationContext?: INotificationContext) {
        const contextualPresenter = notificationContext?.cardPresenter;
        return contextualPresenter || this.cardPresenter.state;
    }
    private getPresenter(
        notification: NotificationRequest,
        notificationContext?: INotificationContext
    ) {
        const contextualPresenter = notificationContext?.presenters?.find(
            (presenter) => presenter.level === notification.level
        );

        return (
            contextualPresenter ||
            this.presenters.state.find((presenter) => presenter.level === notification.level)
        );
    }
}

const NotificationContext = React.createContext<INotificationContext>({} as INotificationContext);

// eslint-disable-next-line react/prop-types
export const NotificationContextProvider: React.FC = ({ children }) => {
    const [presenters, setPresenters] = React.useState<NotificationPresenterRegistration[]>([]);
    const [cardPresenter, setCardPresenter] = React.useState<NotificationCardPresenterRegistration>(
        null
    );

    const registerPresenter = React.useCallback(
        (level: NotificationLevel, present: NotificationPresenter) => {
            const notificationPresenter = {
                level,
                present,
            };

            setPresenters((p) => [notificationPresenter, ...p]);

            return () => {
                setPresenters((p) => p.filter((presenter) => presenter !== notificationPresenter));
            };
        },
        []
    );

    const registerCardPresenter = React.useCallback((present: NotificationCardPresenter) => {
        const notificationPresenter = {
            present,
        };
        setCardPresenter(notificationPresenter);

        return () => {
            setCardPresenter(null);
        };
    }, []);

    return (
        <NotificationContext.Provider
            value={{ presenters, registerPresenter, cardPresenter, registerCardPresenter }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => React.useContext(NotificationContext);

export const useNotificationCenter = () => {
    const { notificationCenter } = useFusionContext();
    const notificationContext = React.useContext(NotificationContext);

    return (notificationRequest: NotificationRequest) =>
        notificationCenter.sendAsync(notificationRequest, notificationContext);
};

export const useNotificationCards = () => {
    const { notificationCenter } = useFusionContext();
    const defaultData = notificationCenter.getNotificationCards();

    const { hubConnection } = useSignalRHub('notifications');

    const [error, setError] = useState(null);
    const [isFetchingUnRead, setIsFetchingUnRead] = useState(false);
    const [isFetchingRead, setIsFetchingRead] = useState(false);
    const [notificationCards, setNotificationCards] = useEventEmitterValue(
        notificationCenter,
        'notification-cards-updated',
        (n) => n,
        defaultData
    );

    const sendNotification = React.useCallback(
        (notification: NotificationCard) => {
            notificationCenter.sendCard(notification);
        },
        [notificationCenter]
    );

    const getUnReadNotificationCardsAsync = async () => {
        setIsFetchingUnRead(true);

        try {
            const filterFromDate = new Date(
                new Date().getTime() - 24 * 60 * 60 * 1000 * 30
            ).toISOString();
            //30 days from today

            const filter = `created gt ${filterFromDate} and seenByUser eq false`;
            const data = await notificationCenter.getNotificationCardsAsync(filter);
            setNotificationCards(data);
        } catch (e) {
            setError(e);
        }

        setIsFetchingUnRead(false);
    };

    const getReadNotificationCardsAsync = async () => {
        setIsFetchingRead(true);

        try {
            const data = await notificationCenter.getNotificationCardsAsync('seenByUser eq true');
            setNotificationCards(data);
        } catch (e) {
            setError(e);
        }

        setIsFetchingRead(false);
    };

    useEffect(() => {
        getUnReadNotificationCardsAsync();
    }, []);

    useEffect(() => {
        if (hubConnection) {
            hubConnection.on('notifications', sendNotification);
            return () => hubConnection.off('notifications', sendNotification);
        }
    }, [hubConnection]);

    return {
        notificationCards,
        isFetchingRead,
        isFetchingUnRead,
        error,
        getReadNotificationCardsAsync,
    };
};

export const useGlobalNotificationCardsActions = () => {
    const { notificationCenter } = useFusionContext();

    const [isMarkingNotifications, setIsMarkingNotifications] = React.useState<boolean>(false);
    const [markError, setMarkError] = React.useState<Error | null>(null);

    const markNotificationsAsSeenAsync = React.useCallback(
        async (notificationCards: NotificationCard[]) => {
            setIsMarkingNotifications(true);
            setMarkError(null);
            try {
                const response = notificationCards.map((card) =>
                    notificationCenter.markNotificationCardAsSeenAsync(card)
                );
                await Promise.all(response);
            } catch (e) {
                setMarkError(e);
            } finally {
                setIsMarkingNotifications(false);
            }
        },
        [notificationCenter]
    );

    return {
        markNotificationsAsSeenAsync,
        isMarkingNotifications,
        markError,
    };
};

export const useNotificationCardActions = (notificationCard: NotificationCard) => {
    const { notificationCenter } = useFusionContext();
    const notificationContext = useNotificationContext();

    const [isMarkingNotification, setIsMarkingNotification] = React.useState<boolean>(false);
    const [markError, setMarkError] = React.useState<Error | null>(null);

    const [isDeletingNotification, setIsDeletingNotification] = React.useState<boolean>(false);
    const [deleteError, setDeleteError] = React.useState<Error | null>(null);

    const markNotificationsAsSeenAsync = React.useCallback(async () => {
        setIsMarkingNotification(true);
        setMarkError(null);
        try {
            await notificationCenter.markNotificationCardAsSeenAsync(notificationCard);
        } catch (e) {
            setMarkError(e);
        } finally {
            setIsMarkingNotification(false);
        }
    }, [notificationCenter, notificationCard]);

    const deleteNotificationAsync = React.useCallback(async () => {
        setIsDeletingNotification(true);
        setDeleteError(null);
        try {
            await notificationCenter.deleteNotificationCardAsync(notificationCard);
        } catch (e) {
            setDeleteError(e);
        } finally {
            setIsDeletingNotification(false);
        }
    }, [notificationCenter, notificationCard]);

    const deleteNotificationCard = React.useCallback(async () => {
        const notificationRequest: NotificationRequest = {
            level: 'high',
            title: 'You are about to permanently delete this notification',
            confirmLabel: 'Delete notification',
            cancelLabel: 'Dismiss',
        };
        const response = await notificationCenter.sendAsync(
            notificationRequest,
            notificationContext
        );
        if (response.confirmed) {
            await deleteNotificationAsync();
        }
    }, [notificationContext, notificationCenter]);

    return {
        markNotificationsAsSeenAsync,
        isMarkingNotification,
        markError,
        deleteNotificationCard,
        isDeletingNotification,
        deleteError,
    };
};
