export type HttpResponse<T> = {
    data: T;
    headers: Headers;
    status: number;
    refreshPromise: Promise<HttpResponse<T>> | null;
};