import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';

export default class NotificationResourceCollection extends BaseResourceCollection {
    protected getBaseUrl() {
        return combineUrls(this.serviceResolver.getNotificationBaseUrl());
    }

    notification(id: string) {
        return combineUrls(this.getBaseUrl(), 'notifications', id);
    }

    personNotifications(personIdentifier: string) {
        return combineUrls(this.getBaseUrl(), 'persons', personIdentifier, 'notifications');
    }
}
