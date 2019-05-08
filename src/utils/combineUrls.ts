const seperator = "/";

export default (base: string, ...parts: string[]) =>
    (parts || [])
        .filter(part => part !== null)
        .reduce(
            (url, part) =>
                url +
                seperator +
                part
                    .toString()
                    .replace(/^\/+/, "")
                    .replace(/\/+$/, ""),
            base || ""
        );
