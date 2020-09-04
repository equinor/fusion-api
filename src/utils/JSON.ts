type Parser = (key: string, value: any) => any;

const dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}[a-zA-Z]{1}[0-9]{2}:[0-9]{2}:[0-9]{2}/im;

const revivers: Parser[] = [
    (key: string, value: any) => {
        if (typeof value === 'string' && dateRegex.test(value)) {
            const parsedDate = new Date(value);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate;
            }
        }

        return value;
    },
];

const replacers: Parser[] = [];

const combine = (parsers: Parser[]) => (key: string, value: any) => {
    return parsers.reduce((val, parser) => parser(key, val), value);
};

const reviver = combine(revivers);
const replacer = combine(replacers);

const parse = <T>(value: string): T => {
    const parsed = JSON.parse(value, reviver);
    return parsed as T;
};

const stringify = <T>(data: T): string => {
    return JSON.stringify(data, replacer);
};

export default { parse, stringify };
