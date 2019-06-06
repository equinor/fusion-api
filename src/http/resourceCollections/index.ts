import DataProxyResourceCollection from "./DataProxyResourceCollection";
import FusionResourceCollection from "./FusionResourceCollection";
import ContextResourceCollection from "./ContextResourceCollection";
import ServiceResolver from "./ServiceResolver";

type ResourceCollections = {
    dataProxy: DataProxyResourceCollection;
    fusion: FusionResourceCollection;
    context: ContextResourceCollection;
};

export { DataProxyResourceCollection };

export const createResourceCollections = (
    serviceResolver: ServiceResolver
): ResourceCollections => ({
    dataProxy: new DataProxyResourceCollection(serviceResolver),
    fusion: new FusionResourceCollection(serviceResolver),
    context: new ContextResourceCollection(serviceResolver),
});

export default ResourceCollections;
