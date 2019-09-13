import version from '../../version';

const defaultHeaders: { [key: string]: string } = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-fusion-api-version': version,
};

type RequestInitTransformer = (init: RequestInit) => RequestInit;

export default (init?: RequestInit | null, transform?: RequestInitTransformer): RequestInit => {
    const headers = new Headers(init && init.headers ? init.headers : new Headers());
    init = {
        ...init,
        headers,
    };

    for (let key in defaultHeaders) {
        headers.append(key, defaultHeaders[key]);
    }

    if (typeof transform === 'undefined') {
        return init;
    }

    return transform(init);
};
