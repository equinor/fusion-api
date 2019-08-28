import version from '../../version';

const defaultHeaders = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-fusion-api-version': version,
});

type RequestInitTransformer = (init: RequestInit) => RequestInit;

export default (init?: RequestInit | null, transform?: RequestInitTransformer): RequestInit => {
    init = {
        ...init,
        headers: new Headers(
            init
                ? {
                      ...defaultHeaders,
                      ...init.headers,
                  }
                : { ...defaultHeaders }
        ),
    };

    if (typeof transform === 'undefined') {
        return init;
    }

    return transform(init);
};
