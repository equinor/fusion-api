import { ContextTypes } from '../../context';

export type AppAuth = {
    clientId: string;
    resources: string[];
};

type AppManifest = {
    key: string;
    name: string;
    shortName: string;
    version: string;
    description: string;
    tags: string[];
    contextTypes?: ContextTypes[];
    auth?: AppAuth;
    icon?: string;
}

export default AppManifest;