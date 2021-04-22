import { ContextTypes } from './ContextTypes';
import { Context } from './Context';

export type ContextManifest = {
    readonly types: ContextTypes[];
    readonly placeholder?: string;
    readonly nullable?: boolean;
    filterContexts?: (contexts: Context[]) => Context[];
    buildUrl?: (context: Context | null, url: string) => string;
    getContextFromUrl?: (url: string) => string;
};
