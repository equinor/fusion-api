type RequestInitTransformer = (init: RequestInit) => RequestInit;
export default (init?: RequestInit, transform?: RequestInitTransformer): RequestInit => {
    init = {
        ...init,
        headers: new Headers(init ? init.headers : {}),
    };

    if (typeof transform === "undefined") {
        return init;
    }

    return transform(init);
};
