type ValidationType = 'Error' | 'Warning' | 'Info';

type ValidationItem = {
    type: ValidationType;
    code: string;
    message: string;
};

type ConfigValidation = {
    isValid: boolean;
    items: ValidationItem[];
};

export { ValidationItem };

export default ConfigValidation;
