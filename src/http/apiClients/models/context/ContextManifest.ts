import { ContextTypes } from './ContextTypes';
import { Context } from './Context';

export class ContextManifest {
    readonly types: ContextTypes[];
    buildUrl?: (context: Context) => string;
    getContextFromUrl?: (url: string) => string;

    constructor(types: ContextTypes[]) {
        this.types = types;
    }
}
