type ServiceResolver = {
    getDataProxyBaseUrl: () => string;
    getFusionBaseUrl: () => string;
    getContextBaseUrl: () => string;
    getOrgBaseUrl: () => string;
    getPowerBiBaseUrl: () => string;
    getTasksBaseUrl: () => string;
    getProjectsBaseUrl: () => string;
};

export default ServiceResolver;