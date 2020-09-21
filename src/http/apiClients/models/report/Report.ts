import Person from './Person';
import SecurityRequirement from './SecurityRequirement';
import SecurityRequirementsPolicy from './SecurityRequirementsPolicy';
import ReportType from './ReportType';

type Report = {
    id: string;
    title: string;
    globalIdentifier?: string | null;
    ownedBy: Person | null;
    publishedBy?: Person;
    userTargetGroup: string;
    dataRefreshRate: string;
    dateCreatedUtc: Date | null;
    dateModifiedUtc: Date | null;
    datePublishedUtc: Date | null;
    dataSources: string;
    access: string;
    allowExternalUsers: boolean;
    isPublished: boolean;
    isEmbedOnly: boolean;
    securityRequirementCheck: SecurityRequirementsPolicy;
    securityRequirements?: SecurityRequirement[];
    reportType: ReportType;
};

export default Report;
