export default class AuthApp {
    clientId: string;
    resources: string[];

    constructor(clientId: string, resources: string[]) {
        this.clientId = clientId;
        this.resources = resources.map(resource => resource.toLowerCase());
    }

    updateResources(resources: string[]): void {
        resources.map(resource => resource.toLowerCase()).forEach(resource => {
            if (this.resources.indexOf(resource) === -1) {
                this.resources.push(resource);
            }
        });
    }
}
