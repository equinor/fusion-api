export class HttpClientError extends Error {}
export class HttpClientParseError extends HttpClientError {
    response: Response;

    constructor(response: Response) {
        super();
        this.response = response;
    }

    async getResponseTextAsync(): Promise<string> {
        return await this.response.text();
    }
}

export class HttpClientRequestFailedError<TErrorResponse> extends HttpClientError {
    constructor(
        public url: string,
        public statusCode: number,
        public response: TErrorResponse,
        public headers?: Headers
    ) {
        super(`[${url}] returned HTTP status code [${statusCode}]`);
    }
}
