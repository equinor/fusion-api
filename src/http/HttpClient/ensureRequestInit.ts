import version from '../../version';

const defaultHeaders: { [key: string]: string } = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-fusion-api-version': version,
};

type RequestInitTransformer = (init: RequestInit) => RequestInit;

export default (init?: RequestInit | null, transform?: RequestInitTransformer): RequestInit => {
    const headers = new Headers();
    for (const key in defaultHeaders) {
        headers.append(key, defaultHeaders[key]);
    }

    if (init && init.headers) {
        const overriddenHeaders = new Headers(init.headers);
        for (const overriddenHeader of overriddenHeaders) {
            headers.set(overriddenHeader[0], overriddenHeader[1]);
        }
    }

    init = {
        ...init,
        headers,
    };

    if (typeof transform === 'undefined') {
        return init;
    }

    return transform(init);
};
