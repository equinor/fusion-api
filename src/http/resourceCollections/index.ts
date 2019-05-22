import DataProxyResourceCollection from "./DataProxyResourceCollection";
import FusionResourceCollection from "./FusionResourceCollection";
import ServiceResolver from "./ServiceResolver";

type ResourceCollections = {
    dataProxy: DataProxyResourceCollection;
    fusion: FusionResourceCollection;
};

export { DataProxyResourceCollection };

export const createResourceCollections = (
    serviceResolver: ServiceResolver
): ResourceCollections => ({
    dataProxy: new DataProxyResourceCollection(serviceResolver),
    fusion: new FusionResourceCollection(serviceResolver),
});

export default ResourceCollections;
