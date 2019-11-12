type EmbedType = 'report' | 'dashboard';
type TokenType = 'AAD' | 'Embed';

type EmbedConfig = {
    name?: string;
    embedType: EmbedType;
    embedUrl: string;
    tokenType: TokenType;
    dashboardId?: string;
    groupId?: string;
    reportId?: string;
    tileId?: string;
};

export default EmbedConfig;
