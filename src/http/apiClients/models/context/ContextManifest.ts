import { ContextType } from './ContextTypes';

export class ContextManifest {
    readonly types: ContextType[];

    constructor(types: ContextType[]) {
        this.types = types;
    }
}
