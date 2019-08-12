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

export const formatDateTime = (date: Date | number) => {
    const parsedDate = new Date(date);
    return dateTimeFormatter.format(parsedDate);
};

export const formatDate = (date: Date | number) => {
    const parsedDate = new Date(date);
    return dateFormatter.format(parsedDate);
};

export const formatTime = (date: Date | number) => {
    const parsedDate = new Date(date);
    return timeFormatter.format(parsedDate);
};

export const formatWeekDay = (date: Date | number) => {
    const parsedDate = new Date(date);
    return weekDayFormatter.format(parsedDate);
};

export const formatDay = (date: Date | number) => {
    const parsedDate = new Date(date);
    return dayFormatter.format(parsedDate);
};

/**
 * Parse a date string to Date
 * @param dateString Expected format: dd/mm/yyyy
 */
export const parseDate = (dateString: string) => {
    const parts = dateString.split('/').map(part => parseInt(part, 10));
    return new Date(parts[2], parts[1] - 1, parts[0]);
};

/**
 * Parse a date time string to Date
 * @param dateTimeString Expected format: dd/mm/yyyy, hh:mm
 */
export const parseDateTime = (dateTimeString: string) => {
    const parts = dateTimeString.split(', ');
    const dateParts = parts[0].split('/').map(part => parseInt(part, 10));
    const timeParts = parts[1].split(':').map(part => parseInt(part, 10));
    return new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1]);
};

export const dateMask = '39/19/9999';
export const timeMask = '29:69';
export const dateTimeMask = `${dateMask}, ${timeMask}`;
