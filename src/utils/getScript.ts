export default (source: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.async = true;
        document.head.appendChild(script);

        script.addEventListener('load', () => resolve());
        script.addEventListener('abort', () => reject());
        script.addEventListener('error', () => reject());

        script.src = source;
    });
};
