import { useState, useEffect } from "react";

export default <T>(value: T, delay: number = 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        });

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};
