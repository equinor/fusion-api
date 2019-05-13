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
    url: string;
    statusCode: number;
    response: TErrorResponse;

    constructor(url: string, statusCode: number, errorResponse: TErrorResponse) {
        super(`[${url}] returned HTTP status code [${statusCode}]`);

        this.url = url;
        this.statusCode = statusCode;
        this.response = errorResponse;
    }
}
