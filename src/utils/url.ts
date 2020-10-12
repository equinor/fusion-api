const separator = '/';

export const trimTrailingSlash = (url: string) => url.replace(/\/$/, '');

export const sanitizedUrl = (url: string) =>
    trimTrailingSlash(url.replace(/(?<=[^:\s])(\/+\/)/g, separator));

export const combineUrls = (base: string, ...parts: string[]) =>
    sanitizedUrl(
        [base]
            .concat(parts)
            .filter((a) => !!a)
            .join(separator)
    );
