import { ContextType } from './ContextTypes';

type ParentContext = {
    id: string;
    type: ContextType;
};

export type Context = {
    id: string;
    externalId: string | null;
    type: ContextType;
    title: string;
    value: any;
    isActive: boolean;
    parent: ParentContext;
};
