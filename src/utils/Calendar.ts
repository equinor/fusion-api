// 0 === sunday
export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type CalendarDate = {
    index: number;
    value: string;
    day: Day;
    month: Month;
    year: number;
    isToday: boolean;
    isSelectedMonth: boolean;
    date: Date;
};

export type Calendar = {
    year: number;
    month: Month;
    dates: CalendarDate[];
    isCurrentMonth: boolean;
};

export const isSameDate = (a: Date, b: Date) => {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
};

const createCalendarDate = (date: Date, month: Month): CalendarDate => {
    const today = new Date();

    return {
        index: date.getDate() - 1,
        value: date.getDate().toString(),
        day: date.getDay() as Day,
        isToday: isSameDate(date, today),
        month: date.getMonth() as Month,
        year: date.getFullYear(),
        isSelectedMonth: date.getMonth() === month,
        date: new Date(date),
    };
};

export const createCalendar = (year: number, month: Month): Calendar => {
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

    const dateInSelectedMonth = new Date(year, month, 1);
    const dates: CalendarDate[] = [];

    while (dateInSelectedMonth.getMonth() === month) {
        dates.push(createCalendarDate(dateInSelectedMonth, month));

        dateInSelectedMonth.setDate(dateInSelectedMonth.getDate() + 1);
    }

    // First day in month is not monday
    if (dates[0].day !== 1) {
        const dateInPreviousMonth = new Date(year, month, 0);
        while (dateInPreviousMonth.getDay() >= 1) {
            dates.unshift(createCalendarDate(dateInPreviousMonth, month));
            dateInPreviousMonth.setDate(dateInPreviousMonth.getDate() - 1);
        }
    }

    // Last day in month is not sunday
    const dateInNextMonth = new Date(year, month, dates[dates.length - 1].index + 1);
    while (dates[dates.length - 1].day !== 0) {
        dateInNextMonth.setDate(dateInNextMonth.getDate() + 1);
        dates.push(createCalendarDate(dateInNextMonth, month));
    }

    return {
        year,
        month,
        isCurrentMonth,
        dates,
    };
};
