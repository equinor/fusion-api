import { ContextTypes } from './ContextTypes';

export class ContextManifest {
    readonly types: ContextTypes[];

    constructor(types: ContextTypes[]) {
        this.types = types;
    }
}
