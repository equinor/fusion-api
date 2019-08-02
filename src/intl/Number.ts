export const formatNumber = (number: string | number, fractionDigits: number = 2) => {
    const parsedNumber = typeof number === 'number' ? number : parseFloat(number);
    return new Intl.NumberFormat('en-GB', {
        style: 'decimal',
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: fractionDigits,
    }).format(parsedNumber);
};

export const formatPercentage = (number: string | number, fractionDigits: number = 0) => {
    const parsedNumber = typeof number === 'number' ? number : parseFloat(number);
    return new Intl.NumberFormat('en-GB', {
        style: 'percent',
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: fractionDigits,
    }).format(parsedNumber);
};

export const formatCurrency = (number: string | number, currency: string = 'NOK', fractionDigits: number = 2) => {
    const parsedNumber = typeof number === 'number' ? number : parseFloat(number);
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency,
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: fractionDigits,
    }).format(parsedNumber);
};