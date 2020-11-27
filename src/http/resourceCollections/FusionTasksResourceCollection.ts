import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';

export default class FusionTasksResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return this.serviceResolver.getFusionTasksBaseUrl();
    }

    personTasks(personId: string): string {
        return combineUrls(this.getBaseUrl(), 'persons', personId, 'tasks');
    }

    pimsTasks(personId: string, taskType: string): string {
        return combineUrls(this.personTasks(personId), 'pims', taskType);
    }

    procosysTasks(personId: string): string {
        return combineUrls(this.personTasks(personId), 'procosys');
    }
}
