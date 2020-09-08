const seperator = '/';

export const trimTrailingSlash = (url: string) => url.replace(/\/$/, '');

export const combineUrls = (base: string, ...parts: string[]) =>
    trimTrailingSlash(
        (parts || [])
            .filter((part) => part)
            .reduce(
                (url, part) =>
                    url +
                    seperator +
                    part
                        .toString()
                        .replace(/^\/+/, '')
                        .replace(/\/+$/, '')
                        .replace(/\/\//gm, seperator),
                base || ''
            )
    );
