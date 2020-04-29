import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from '.';
import GlobalNotification from './models/GlobalNotification/GlobalNotification';
import { CreateNotification } from './models/GlobalNotification/CreateNotification';

export default class NotificationClient extends BaseApiClient {
    protected getBaseUrl() {
        return this.serviceResolver.getNotificationBaseUrl();
    }

    async getNotificationAsync(notificationId: string) {
        const url = this.resourceCollections.notification.notification(notificationId);
        return this.httpClient.getAsync<GlobalNotification, FusionApiHttpErrorResponse>(url);
    }

    async updateNotificationAsync(
        notificationId: string,
        updatedProperties: Partial<GlobalNotification>
    ) {
        const url = this.resourceCollections.notification.notification(notificationId);
        return this.httpClient.patchAsync<
            Partial<GlobalNotification>,
            GlobalNotification,
            FusionApiHttpErrorResponse
        >(url, updatedProperties);
    }

    async deleteNotificationAsync(notificationId: string) {
        const url = this.resourceCollections.notification.notification(notificationId);
        return this.httpClient.deleteAsync<void, FusionApiHttpErrorResponse>(url, null, () =>
            Promise.resolve()
        );
    }

    async getPersonNotificationsAsync(personId: string) {
        const url = this.resourceCollections.notification.personNotifications(personId);
        return this.httpClient.getAsync<GlobalNotification[], FusionApiHttpErrorResponse>(url);
    }

    async createPersonNotificationAsync(personId: string, payload: CreateNotification) {
        const url = this.resourceCollections.notification.personNotifications(personId);
        return this.httpClient.postAsync<
            CreateNotification,
            GlobalNotification,
            FusionApiHttpErrorResponse
        >(url, payload);
    }
}
