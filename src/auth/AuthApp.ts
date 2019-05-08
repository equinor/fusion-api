export default class AuthApp {
    clientId: string;
    resources: string[];

    constructor(clientId: string, resources: string[]) {
        this.clientId = clientId;
        this.resources = resources;
    }

    updateResources(resources: string[]): void {
        resources.forEach(resource => {
            if (this.resources.indexOf(resource) === -1) {
                this.resources.push(resource);
            }
        });
    }
}
