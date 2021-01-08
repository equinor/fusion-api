export const trimTrailingSlash = (url: string) => url.replace(/\/$/, '');

export const sanitizedUrl = (url: string) =>
    trimTrailingSlash(url.replace(/(\w:\/\/)|(\/)+/g, '$1$2'));

export const combineUrls = (base: string, ...parts: string[]) =>
    sanitizedUrl(
        [base]
            .concat(parts)
            .filter((a) => !!a)
            .join('/')
    );
