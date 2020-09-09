type PagedCollection<T> = {
    '@prevPage': string | null;
    count: number;
    totalCount: number;
    value: T;
};
export default PagedCollection;
