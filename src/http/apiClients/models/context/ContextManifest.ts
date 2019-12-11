import { ContextTypes } from './ContextTypes';
import { Context } from './Context';

export class ContextManifest {
    readonly types: ContextTypes[];
    buildURL?: (context: Context) => string;
    getContextFromUrl?: (url: string) => string;

    constructor(types: ContextTypes[]) {
        this.types = types;
        this.buildURL = this.buildURL;
        this.getContextFromUrl = this.getContextFromUrl;
    }
}
