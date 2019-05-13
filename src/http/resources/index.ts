import DataProxyResources from "./DataProxy";
import ServiceResolver from "./ServiceResolver";

type Resources = {
    dataProxy: DataProxyResources;
};

export const createResources = (serviceResolver: ServiceResolver): Resources => ({
    dataProxy: new DataProxyResources(serviceResolver),
});

export default Resources;