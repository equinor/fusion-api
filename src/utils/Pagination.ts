import { useState, useEffect } from 'react';

export type Page = {
    index: number;
    value: string;
};

const getPaginationHead = (pages: Page[], currentPage: Page, padding: number) => {
    if (currentPage.index < padding || pages.length <= padding) {
        return [];
    }

    return pages.slice(0, 1);
};

const getPaginationTail = (pages: Page[], currentPage: Page, padding: number) => {
    if (currentPage.index >= pages.length - padding || pages.length <= padding) {
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

const getNextPage = (pages: Page[], currentPage: Page) => {
    const nextIndex = currentPage.index + 1;
    return pages[nextIndex] || pages[0];
};

const getPrevPage = (pages: Page[], currentPage: Page) => {
    const prevIndex = currentPage.index - 1;
    return pages[prevIndex] || pages[pages.length - 1];
};

const toPage = (index: number): Page => ({
    index,
    value: (index + 1).toString(),
});

export type Pagination = {
    rowCount: number;
    perPage: number;
    pageCount: number;
    pages: Page[];
    head: Page[];
    center: Page[];
    tail: Page[];
    currentPage: Page;
    nextPage: Page;
    prevPage: Page;
};

export const applyPagination = <T>(data: T[], { perPage, currentPage }: Pagination) => {
    return data.slice(perPage * currentPage.index, perPage * currentPage.index + perPage);
};

export const createPagination = (
    rowCount: number,
    perPage: number,
    currentPageIndex: number = 0,
    padding: number = 3
) => {
    const pageCount = Math.ceil(rowCount / perPage);
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

    return {
        rowCount,
        perPage,
        pageCount,
        pages,
        head,
        tail,
        center,
        currentPage,
        nextPage,
        prevPage,
    };
};

export const usePagination = <T>(
    data: T[],
    perPage: number,
    currentPageIndex: number = 0,
    padding: number = 3
) => {
    const [internalCurrentPageIndex, setCurrentPageIndex] = useState(currentPageIndex);
    const [pagination, setPagination] = useState<Pagination>(createPagination(data.length, perPage, currentPageIndex, padding));
    const [pagedData, setPagedData] = useState<T[]>(applyPagination(data, pagination));

    useEffect(() => {
        const newPagination = createPagination(data.length, perPage, currentPageIndex, padding);
        const newPagedData = applyPagination(data, newPagination);
        setPagination(newPagination);
        setPagedData(newPagedData);
    }, [data, internalCurrentPageIndex]);

    return {
        pagination,
        pagedData,
        setCurrentPageIndex,
    };
};