export class PowerBIError extends Error {
    code: number;
    message: string;

    constructor(code: number, message: string) {
        super(message);
        this.message = message;
        this.code = code;
    }
}

export default PowerBIError;
