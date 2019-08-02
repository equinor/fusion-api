const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
});

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
});

export const formatDateTime = (date: Date | string | number) => {
    const parsedDate = new Date(date);
    return dateTimeFormatter.format(parsedDate);
};

export const formatDate = (date: Date | string | number) => {
    const parsedDate = new Date(date);
    return dateFormatter.format(parsedDate);
};

export const formatTime = (date: Date | string | number) => {
    const parsedDate = new Date(date);
    return timeFormatter.format(parsedDate);
};
