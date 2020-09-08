type ServiceResolver = {
    getDataProxyBaseUrl: () => string;
    getFusionBaseUrl: () => string;
    getContextBaseUrl: () => string;
    getOrgBaseUrl: () => string;
    getPowerBiBaseUrl: () => string;
    getTasksBaseUrl: () => string;
    getProjectsBaseUrl: () => string;
    getMeetingsBaseUrl: () => string;
    getPeopleBaseUrl: () => string;
    getReportsBaseUrl: () => string;
    getPowerBiApiBaseUrl: () => string;
    getNotificationBaseUrl: () => string;
    getInfoUrl: () => string;
};

export default ServiceResolver;
