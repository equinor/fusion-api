// Will use the built in console in dev,
// but replaced with mocked console with empty methods for production
export default process.env.NODE_ENV !== 'production' ? console :  (() => {
    const mockConsole: any = {};

    for (const key in console) {
        mockConsole[key] = () => null;
    }

    return mockConsole as Console;
})();
