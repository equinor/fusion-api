import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from '.';
import NotificationCard from './models/NotificationCard/NotificationCard';
import { CreateNotification } from './models/NotificationCard/CreateNotification';
import PagedCollection from '../models/PagedCollection';
import { PersonNotificationSettings } from './models/people/PersonDetails';

export default class NotificationClient extends BaseApiClient {
    protected getBaseUrl() {
        return this.serviceResolver.getNotificationBaseUrl();
    }

    async getNotificationAsync(notificationId: string) {
        const url = this.resourceCollections.notification.notification(notificationId);
        return this.httpClient.getAsync<NotificationCard, FusionApiHttpErrorResponse>(url);
    }

    async updateNotificationAsync(
        notificationId: string,
        updatedProperties: Partial<NotificationCard>
    ) {
        const url = this.resourceCollections.notification.notification(notificationId);
        return this.httpClient.patchAsync<
            Partial<NotificationCard>,
            NotificationCard,
            FusionApiHttpErrorResponse
        >(url, updatedProperties);
    }

    async deleteNotificationAsync(notificationId: string) {
        const url = this.resourceCollections.notification.notification(notificationId);
        return this.httpClient.deleteAsync<void, FusionApiHttpErrorResponse>(url, null, () =>
            Promise.resolve()
        );
    }

    async getPersonNotificationsAsync(personId: string, filter?: string) {
        const url = this.resourceCollections.notification.personNotifications(personId, filter);
        return this.httpClient.getAsync<
            PagedCollection<NotificationCard[]>,
            FusionApiHttpErrorResponse
        >(url);
    }

    async createPersonNotificationAsync(personId: string, payload: CreateNotification) {
        const url = this.resourceCollections.notification.personNotifications(personId);
        return this.httpClient.postAsync<
            CreateNotification,
            NotificationCard,
            FusionApiHttpErrorResponse
        >(url, payload);
    }

    getPersonNotificationSettingsAsync() {
        const url = this.resourceCollections.notification.personNotificationSettings();
        return this.httpClient.getAsync<PersonNotificationSettings, FusionApiHttpErrorResponse>(
            url
        );
    }

    updatePersonNotificationSettings(notificationSettings: PersonNotificationSettings) {
        const url = this.resourceCollections.notification.personNotificationSettings();
        return this.httpClient.putAsync<
            PersonNotificationSettings,
            PersonNotificationSettings,
            FusionApiHttpErrorResponse
        >(url, notificationSettings);
    }
}
