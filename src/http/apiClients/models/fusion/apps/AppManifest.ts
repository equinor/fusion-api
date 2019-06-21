import { ContextTypes } from '../../context';

export type AppAuth = {
    clientId: string;
    resources: string[];
};

type AppManifest = {
    key: string;
    name: string;
    shortName: string;
    description: string;
    version: string;
    contextTypes?: ContextTypes[];
    auth?: AppAuth;
}

export default AppManifest;