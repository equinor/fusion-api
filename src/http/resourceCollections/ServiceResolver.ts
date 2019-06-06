type ServiceResolver = {
    getDataProxyBaseUrl: () => string;
    getFusionBaseUrl: () => string;
    getContextBaseUrl: () => string;
};

export default ServiceResolver;
