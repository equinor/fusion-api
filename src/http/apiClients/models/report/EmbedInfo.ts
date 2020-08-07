import EmbedConfig from './EmbedConfig';

export type EmbedConfigType = 'PowerBI';

type EmbedInfo = {
    type: EmbedConfigType;
    embedConfig: EmbedConfig;
};

export default EmbedInfo;
