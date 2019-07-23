import { useState, useEffect } from "react";

export type PropertyAccessorFunction<T> = (item: T) => string | null;
export type PropertyAccessor<T> = keyof T | PropertyAccessorFunction<T>;

export type SortDirection = "asc" | "desc";

const getValue = <T>(item: T | null, accessor: PropertyAccessor<T>) => {
    if (!item) {
        return null;
    }

    if (typeof accessor === "string") {
        const value = item[accessor] as any;
        return value ? value.toString() : null;
    }

    const accessorFunction = accessor as PropertyAccessorFunction<T>;
    const value = accessorFunction(item);
    return value ? value.toString() : null;
};

export const applySorting = <T>(
    data: readonly T[],
    sortBy: PropertyAccessor<T> | null = null,
    direction: SortDirection | null = null
) => {
    if (!sortBy || !direction) {
        return data;
    }

    const comparer = new Intl.Collator('co', { numeric: true }).compare;
    return data.slice().sort((a, b) => {
        const aValue = getValue(a, sortBy);
        const bValue = getValue(b, sortBy);

        if (!aValue && !bValue) {
            return 0;
        } else if (!aValue) {
            return direction === "asc" ? 1 : -1;
        } else if (!bValue) {
            return direction === "asc" ? -1 : 1;
        }

        return direction === "asc" ? comparer(aValue, bValue) : comparer(bValue, aValue);
    });
};

const cycleSortDirection = (direction: SortDirection | null): SortDirection | null => {
    if (!direction) {
        return "asc";
    } else if (direction === "asc") {
        return "desc";
    }

    return null;
};

export default <T>(
    data: readonly T[],
    defaultSortBy: PropertyAccessor<T> | null = null,
    defaultDirection: SortDirection | null = null
) => {
    const [sortBy, setSortBy] = useState<PropertyAccessor<T> | null>(defaultSortBy);
    const [direction, setDirection] = useState<SortDirection | null>(defaultDirection);
    const [sortedData, setSortedData] = useState(applySorting(data, sortBy, direction));

    useEffect(() => {
        setSortedData(applySorting(data, sortBy, direction));
    }, [data, sortBy, direction]);

    const resetSorting = () => {
        setSortBy(null);
        setDirection(null);
    };

    const updateSortBy = (newSortBy: PropertyAccessor<T> | null, newDirection: SortDirection | null) => {
        newDirection =
            newDirection || sortBy === newSortBy || !newSortBy
                ? cycleSortDirection(direction)
                : cycleSortDirection(null);

        setSortBy(newSortBy);
        setDirection(newDirection);
    };

    return {
        sortedData,
        sortBy,
        direction,
        setSortBy: updateSortBy,
        resetSorting,
    };
};
