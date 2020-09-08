import { trimTrailingSlash } from '../utils/url';

export default class AuthApp {
    clientId: string;
    resources: string[] = [];

    constructor(clientId: string, resources: string[]) {
        this.clientId = clientId;
        this.updateResources(resources);
    }

    updateResources(resources: string[]): void {
        resources
            .map((resource) => trimTrailingSlash(resource.toLowerCase()))
            .forEach((resource) => {
                if (this.resources.indexOf(resource) === -1) {
                    this.resources.push(resource);
                }
            });
    }
}
