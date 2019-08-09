const locale = 'en-GB';
const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
});

const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
});

const weekDayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });

const dayFormatter = new Intl.DateTimeFormat(locale, { day: '2-digit' });

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

export const formatWeekDay = (date: Date | string | number) => {
    const parsedDate = new Date(date);
    return weekDayFormatter.format(parsedDate);
};

export const formatDay = (date: Date | string | number) => {
    const parsedDate = new Date(date);
    return dayFormatter.format(parsedDate);
};