import SecurityRequirementsPolicy from './SecurityRequirementsPolicy';

type SecurityDetails = {
    disciplines: string[] | null;
    policy: SecurityRequirementsPolicy;
    allowExternalUsers: boolean;
};

export default SecurityDetails;
