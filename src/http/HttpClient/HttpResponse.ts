export type HttpResponse<T> = {
    data: T;
    headers: Headers;
    status: number;
    refreshRequest: RequestInit | null;
};
