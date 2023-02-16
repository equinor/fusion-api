import RlsConfiguration from './RlsConfiguration';
import ResourceType from './ResourceType';
export type TokenType = 'AAD' | 'Embed';

type EmbedConfig = {
    embedType: ResourceType;
    embedUrl: string;
    tokenType: TokenType;
    name?: string;
    dashboardId?: string;
    datasetId?: string;
    groupId?: string;
    reportId?: string;
    tileId?: string;
    rlsConfiguration?: RlsConfiguration | null;
    contrastMode?: number;
};

export default EmbedConfig;
