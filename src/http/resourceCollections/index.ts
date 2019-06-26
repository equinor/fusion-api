import DataProxyResourceCollection from "./DataProxyResourceCollection";
import FusionResourceCollection from "./FusionResourceCollection";
import ContextResourceCollection from "./ContextResourceCollection";
import ServiceResolver from "./ServiceResolver";
import { FusionContextOptions } from "../../core/FusionContext";

type ResourceCollections = {
    dataProxy: DataProxyResourceCollection;
    fusion: FusionResourceCollection;
    context: ContextResourceCollection;
};

export { DataProxyResourceCollection };

export const createResourceCollections = (
    serviceResolver: ServiceResolver,
    options?: FusionContextOptions
): ResourceCollections => ({
    dataProxy: new DataProxyResourceCollection(serviceResolver),
    fusion: new FusionResourceCollection(serviceResolver, options),
    context: new ContextResourceCollection(serviceResolver),
});

export default ResourceCollections;
