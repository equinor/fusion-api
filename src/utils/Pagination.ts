import { useState, useEffect, useCallback } from "react";
import { withAbortController } from "./AbortControllerManager";

export type Page = {
    index: number;
    value: string;
};

const getPaginationHead = (pages: Page[], currentPage: Page, padding: number) => {
    if (currentPage.index < padding - 1 || pages.length <= padding) {
        return [];
    }

    return pages.slice(0, 1);
};

const getPaginationTail = (pages: Page[], currentPage: Page, padding: number) => {
    if (currentPage.index > pages.length - padding || pages.length <= padding) {
        return [];
    }

    return pages.slice(pages.length - 1, pages.length);
};

const getPaginationCenter = (pages: Page[], currentPage: Page, padding: number) => {
    const distance = Math.floor(padding / 2);
    const start = Math.max(currentPage.index - distance, 0);
    const end = Math.max(currentPage.index + distance + 1, padding);
    return pages.slice(start, end);
};

const getNextPage = (pages: Page[], currentPage: Page): Page | null => {
    const nextIndex = currentPage.index + 1;
    return pages[nextIndex] || null;
};

const getPrevPage = (pages: Page[], currentPage: Page): Page | null => {
    const prevIndex = currentPage.index - 1;
    return pages[prevIndex] || null;
};

const getPaginationRange = (totalCount: number, perPage: number, currentPage: Page) => {
    return {
        from: currentPage.index * perPage + 1,
        to: Math.min((currentPage.index * perPage) + perPage, totalCount),
    };
};

const toPage = (index: number): Page => ({
    index,
    value: (index + 1).toString(),
});

export type PaginationRange = {
    from: number;
    to: number;
};

export type Pagination = {
    totalCount: number;
    perPage: number;
    pageCount: number;
    pages: Page[];
    head: Page[];
    center: Page[];
    tail: Page[];
    currentPage: Page;
    nextPage: Page | null;
    prevPage: Page | null;
    range: PaginationRange;
};

export const applyPagination = <T>(data: T[], { perPage, currentPage }: Pagination) => {
    return data.slice(perPage * currentPage.index, perPage * currentPage.index + perPage);
};

export const createPagination = (
    totalCount: number,
    perPage: number,
    currentPageIndex: number = 0,
    padding: number = 3
): Pagination => {
    const pageCount = Math.ceil(totalCount / perPage);
    const pages: Page[] = [];
    for (let i = 0; i < pageCount; i++) {
        pages.push(toPage(i));
    }

    const currentPage = toPage(currentPageIndex);
    const head = getPaginationHead(pages, currentPage, padding);
    const tail = getPaginationTail(pages, currentPage, padding);
    const center = getPaginationCenter(pages, currentPage, padding);

    const nextPage = getNextPage(pages, currentPage);
    const prevPage = getPrevPage(pages, currentPage);

    const range = getPaginationRange(totalCount, perPage, currentPage);

    return {
        totalCount,
        perPage,
        pageCount,
        pages,
        head,
        tail,
        center,
        currentPage,
        nextPage,
        prevPage,
        range,
    };
};

export type PaginationHook<T> = {
    pagination: Pagination;
    pagedData: T[];
    setCurrentPage: (index: number, perPage: number) => void;
};

export const usePagination = <T>(
    data: T[],
    initialPerPage: number = 20,
    initialCurrentPageIndex: number = 0,
    padding: number = 3
): PaginationHook<T> => {
    const [currentPageIndex, setCurrentPageIndex] = useState(initialCurrentPageIndex);
    const [perPage, setPerPage] = useState(initialPerPage);
    const [pagination, setPagination] = useState<Pagination>(
        createPagination(data.length, perPage, currentPageIndex, padding)
    );
    const [pagedData, setPagedData] = useState<T[]>(applyPagination(data, pagination));

    useEffect(() => {
        const newPagination = createPagination(data.length, perPage, currentPageIndex, padding);
        const newPagedData = applyPagination(data, newPagination);
        setPagination(newPagination);
        setPagedData(newPagedData);
    }, [data, currentPageIndex, perPage]);

    const setCurrentPage = useCallback((index: number, perPage: number) => {
        setCurrentPageIndex(index);
        setPerPage(perPage);
    }, []);

    return {
        pagination,
        pagedData,
        setCurrentPage,
    };
};

export type PagedResult<T> = {
    items: T[];
    totalCount: number;
};

export type AsyncPaginationHook<T> = PaginationHook<T> & {
    isFetching: boolean;
    error: Error | null;
};

export const useAsyncPagination = <T>(
    fetchAsync: (pagination: Pagination) => Promise<PagedResult<T>>,
    initialPerPage: number,
    initialCurrentPageIndex: number = 0,
    padding: number = 3,
    deps: readonly any[] = []
): AsyncPaginationHook<T> => {
    const [currentPageIndex, setCurrentPageIndex] = useState(initialCurrentPageIndex);
    const [perPage, setPerPage] = useState(initialPerPage);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [pagedData, setPagedData] = useState<T[]>([]);
    const [pagination, setPagination] = useState<Pagination>(
        createPagination(0, perPage, currentPageIndex, padding)
    );

    useEffect(() => {
        setPagedData([]);
        setPagination(createPagination(pagination.totalCount, perPage, currentPageIndex, padding));
    }, [currentPageIndex, perPage, ...deps]);

    const abortable = withAbortController();
    useEffect(() => {
        setIsFetching(true);

        return abortable(async signal => {
            try {
                const result = await fetchAsync(pagination);

                if (signal.aborted) {
                    return;
                }

                setPagedData(result.items);
                setPagination(
                    createPagination(result.totalCount, perPage, currentPageIndex, padding)
                );
                setError(null);
            } catch (e) {
                setError(e);
            }

            setIsFetching(false);
        });
    }, [pagination]);

    const setCurrentPage = useCallback((index: number, perPage: number) => {
        setCurrentPageIndex(index);
        setPerPage(perPage);
    }, []);

    return {
        pagination,
        pagedData,
        isFetching,
        error,
        setCurrentPage,
    };
};
