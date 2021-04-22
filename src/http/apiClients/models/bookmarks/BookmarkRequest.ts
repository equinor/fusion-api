type BookmarkRequest = {
    name: string;
    description?: string;
    isShared: boolean;
    appKey: string;
    contextId?: string;
    payload: unknown;
};

export default BookmarkRequest;
