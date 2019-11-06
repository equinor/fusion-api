import Person from './Person';
import SecurityRequirement from './SecurityRequirement';
import SecurityRequirementsPolicy from './SecurityRequirementsPolicy';
import ReportType from './ReportType';

type Report = {
    id: string;
    title: string;
    ownedBy: Person;
    publishedBy?: Person;
    userTargetGroup: string;
    dataRefreshRate: string;
    dateCreatedUtc: Date | null;
    dateModifiedUtc: Date | null;
    datePublishedUtc: Date | null;
    dataSources: string;
    access: string;
    isPublished: boolean;
    allowExternalUsers: boolean;
    securityRequirementCheck: SecurityRequirementsPolicy | null;
    securityRequirements?: SecurityRequirement[];
    reportType: ReportType;
    isEmbedOnly: boolean;
};

export default Report;
