type ServiceResolver = {
    getDataProxyBaseUrl: () => string;
    getFusionBaseUrl: () => string;
    getContextBaseUrl: () => string;
    getOrgBaseUrl: () => string;
    getPowerBiBaseUrl: () => string;
    getTasksBaseUrl: () => string;
    getProjectsApiUrl: () => string;
};

export default ServiceResolver;