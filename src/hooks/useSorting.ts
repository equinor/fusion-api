import { useState, useEffect } from "react";

export type PropertyAccessorFunction<T> = (item: T) => string | null;
export type PropertyAccessor<T> = keyof T | PropertyAccessorFunction<T>;

export type SortDirection = "asc" | "desc";

/**
 * Gets the value from an item based on the accessor (which may be a string or a function)
 * @param item The item
 * @param accessor The accessor
 */
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

/**
 * Apply sort to a data set
 * @param data The data to sort
 * @param sortBy The property to sort by or an accessor function
 * @param direction Sort direction
 */
export const applySorting = <T>(
    data: T[],
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

        // Sort null/falsy values at the end/beginning for asc/desc respectively
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

/**
 * Cycle the direction. E.g. null > asc > desc > null > repeat
 * @param direction Current direction
 */
const cycleSortDirection = (direction: SortDirection | null): SortDirection | null => {
    if (!direction) {
        return "asc";
    } else if (direction === "asc") {
        return "desc";
    }

    return null;
};

/**
 * Sorting hook that takes care of sorting and storing the sort by and direction
 * If the default sort by of direction is null, no initial sorting will be applied
 * @param data The data to sort
 * @param defaultSortBy The default sort property
 * @param defaultDirection The default direction
 */
export const useSorting = <T>(
    data: T[],
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
        // Figure out the new direction
        newDirection =
            newDirection || sortBy === newSortBy || !newSortBy
                ? cycleSortDirection(direction)
                : cycleSortDirection(null);

        // The new sort by accessor might be a function,
        // passing it directly to setSortBy would invoke it as a setter
        setSortBy(() => newSortBy);
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
