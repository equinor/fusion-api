import { ContextManifest } from '../../context';
import AppCategory from './AppCategory';
import AppType from './AppType';

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
    type: AppType;
    tags: string[];
    context?: ContextManifest;
    auth?: AppAuth[];
    icon?: string;
    order: number | null;
    publishedDate: Date | null;
    accentColor: string | null;
    categoryId: string | null;
    category: AppCategory | null;
    hide?: boolean;
};

export default AppManifest;
