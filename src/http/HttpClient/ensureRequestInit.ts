type RequestInitTransformer = (init: RequestInit) => RequestInit;
export default (init?: RequestInit | null, transform?: RequestInitTransformer): RequestInit => {
    init = {
        ...init,
        headers: new Headers(
            init
                ? init.headers
                : {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  }
        ),
    };

    if (typeof transform === 'undefined') {
        return init;
    }

    return transform(init);
};
