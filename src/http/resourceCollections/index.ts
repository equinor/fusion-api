import DataProxyResourceCollection from "./DataProxyResourceCollection";
import ServiceResolver from "./ServiceResolver";

type ResourceCollections = {
    dataProxy: DataProxyResourceCollection;
};

export { DataProxyResourceCollection };

export const createResourceCollections = (
    serviceResolver: ServiceResolver
): ResourceCollections => ({
    dataProxy: new DataProxyResourceCollection(serviceResolver),
});

export default ResourceCollections;
