import ServiceResolver from "./ServiceResolver";

export default abstract class BaseResourceCollection {
    protected serviceResolver: ServiceResolver;

    constructor(serviceResolver: ServiceResolver) {
        this.serviceResolver = serviceResolver;
    }
}
