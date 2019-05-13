export type FusionApiModelBindingError = {
    message: string;
    property: string;
    attemptedValue: any;
};

export type FusionApiErrorMessage = {
    code: string;
    message: string;
    errors: FusionApiModelBindingError[];
};

export type FusionApiHttpErrorResponse = {
    error: FusionApiErrorMessage;
};
