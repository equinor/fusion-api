import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';

export class UserSettingsResourceCollection extends BaseResourceCollection {
    protected getBaseUrl() {
        return combineUrls(this.serviceResolver.getFusionBaseUrl());
    }

    public appUserSettings(appKey: string): string {
        return combineUrls(this.getBaseUrl(), 'api', 'persons', 'me', 'settings', 'apps', appKey);
    }

    public fusionUserSettings(): string {
        return combineUrls(this.getBaseUrl(), 'api', 'persons', 'me', 'settings', 'fusion');
    }
}

export default UserSettingsResourceCollection;
