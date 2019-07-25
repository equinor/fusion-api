import { useState, useEffect, useCallback } from "react";
import { withAbortController } from "./AbortControllerManager";

/**
 * Represents a single page in Pagination
 */
export type Page = {
    index: number;
    value: string;
};

/**
 * Gets the head of the pagination buttons.
 * E.g. [1] ... 5 6 7 ... 100
 * @param pages All pages in the pagination
 * @param currentPage The current page
 * @param padding How mutch padding do you want?
 */
const getPaginationHead = (pages: Page[], currentPage: Page, padding: number) => {
    // Don't get pagination head if we're in the first few pages (based on the padding)
    if (currentPage.index < padding - 1 || pages.length <= padding) {
        return [];
    }

    return pages.slice(0, 1);
};

/**
 * Gets the tail of the pagination buttons.
 * E.g. 1 ... 5 6 7 ... [100]
 * @param pages All pages in the pagination
 * @param currentPage The current page
 * @param padding How mutch padding do you want?
 */
const getPaginationTail = (pages: Page[], currentPage: Page, padding: number) => {
    // Don't get the pagination tail if we're in the last few pages (based on the padding)
    if (currentPage.index > pages.length - padding || pages.length <= padding) {
        return [];
    }

    return pages.slice(pages.length - 1, pages.length);
};

/**
 * Gets the center of the pagination buttons.
 * E.g. 1 ... [5 6 7] ... 100
 * @param pages All pages in the pagination
 * @param currentPage The current page
 * @param padding How mutch padding do you want?
 */
const getPaginationCenter = (pages: Page[], currentPage: Page, padding: number) => {
    // Divide the padding in two to get the distance from the current page
    const distance = Math.floor(padding / 2);
    
    // Get the start index. If we're at the last page, get the last index minus the padding
    // otherwise get the negative distance from the current page or index 0 when we're at the first few pages
    const start =
        currentPage.index === pages.length - 1
            ? pages.length - padding
            : Math.max(currentPage.index - distance, 0);
    
    const end = Math.max(currentPage.index + distance + 1, padding);
    return pages.slice(start, end);
};

/**
 * Gets the next page based on the current page
 * @param pages All pages in the pagination
 * @param currentPage The current page
 */
const getNextPage = (pages: Page[], currentPage: Page): Page | null => {
    const nextIndex = currentPage.index + 1;
    return pages[nextIndex] || null;
};

/**
 * Gets the previous page based on the current page
 * @param pages All pages in the pagination
 * @param currentPage The current page
 */
const getPrevPage = (pages: Page[], currentPage: Page): Page | null => {
    const prevIndex = currentPage.index - 1;
    return pages[prevIndex] || null;
};

/**
 * Gets the range of item displayed based on the current page and per page
 * @param totalCount Total number of items in the pagination
 * @param perPage How many items per page do you want?
 * @param currentPage The current page
 */
const getPaginationRange = (totalCount: number, perPage: number, currentPage: Page) => {
    return {
        from: currentPage.index * perPage + 1,
        to: Math.min(currentPage.index * perPage + perPage, totalCount),
    };
};

/** Convert a page index to a Page */
const toPage = (index: number): Page => ({
    index,
    value: (index + 1).toString(),
});

/** Represents a pagination range */
export type PaginationRange = {
    from: number;
    to: number;
};

/** Represents everything needed to apply and display pagination */
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

/**
 * Apply a Pagination object to a set of data
 * @param data The data to apply the pagination to
 * @param pagination The pagination
 */
export const applyPagination = <T>(data: T[], { perPage, currentPage }: Pagination) => {
    return data.slice(perPage * currentPage.index, perPage * currentPage.index + perPage);
};

/**
 * Create a Pagination object to apply and display pagination
 * @param totalCount Total number of items to be paginated
 * @param perPage How many items per page do you want?
 * @param currentPageIndex What's the current page index?
 * @param padding How much padding do you want in the pagination buttons?
 */
export const createPagination = (
    totalCount: number,
    perPage: number,
    currentPageIndex: number = 0,
    padding: number = 3
): Pagination => {
    // Calculate and create all pages needed
    const pageCount = Math.ceil(totalCount / perPage);
    const pages: Page[] = [];
    for (let i = 0; i < pageCount; i++) {
        pages.push(toPage(i));
    }

    // Create convenience data for displaying pagination buttons
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

/** The result of usePagination */
export type PaginationHook<T> = {
    pagination: Pagination;
    pagedData: T[];
    setCurrentPage: (index: number, perPage: number) => void;
};

/**
 * Pagination hook that creates and applies pagination to a given data set.
 * Returns the paged data, a function to set the current page 
 * and the Pagination object that can be used to display pagination buttons
 * @param data The data to be paginated
 * @param initialPerPage Initial number of items per page
 * @param initialCurrentPageIndex Initial current page index
 * @param padding How much padding do you want in the pagination buttons?
 */
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

/** Represents the result of a data set that's already paged. E.g. from the server */
export type PagedResult<T> = {
    items: T[];
    totalCount: number;
};

/** The result of usePaginationAsync */
export type AsyncPaginationHook<T> = PaginationHook<T> & {
    isFetching: boolean;
    error: Error | null;
};

/**
 * Pagination hook that creates pagination and passes that along
 * to an async function that applies the pagination (e.g. sends a fetch-request to an API somewhere.)
 * Returns the paged data, a function to set the current page, whether it's currently fetching or not,
 * whether any errors occured and the Pagination object that can be used to display pagination buttons
 * @param applyAsync The async function to apply the pagination to a data set
 * @param initialPerPage Initial number of items per page
 * @param initialCurrentPageIndex Initial current page index
 * @param padding How much padding do you want in the pagination buttons?
 * @param deps Other external dependencies that might trigger the pagination (e.g. sorting changed)
 */
export const useAsyncPagination = <T>(
    applyAsync: (pagination: Pagination) => Promise<PagedResult<T>>,
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

    const abortable = withAbortController();
    const applyPaginationAsync = (pagination: Pagination) => {
        setIsFetching(true);

        // Wrap the applyAsync function in abortable to allow the pagination to be changed
        // while the fetch is in progress
        return abortable(async signal => {
            try {
                const result = await applyAsync(pagination);

                // Don't use the paginated data if the action has been aborted (e.g. the user switched to another page)
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
    };

    useEffect(() => {
        setPagedData([]);
        const newPagination = createPagination(
            pagination.totalCount,
            perPage,
            currentPageIndex,
            padding
        );
        setPagination(newPagination);

        return applyPaginationAsync(newPagination);
    }, [currentPageIndex, perPage, ...deps]);

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
