import BookmarkRequest from './BookmarkRequest';

export type BookmarkPatchRequest = Partial<Omit<BookmarkRequest, 'appKey' | 'contextId'>>;

export default BookmarkPatchRequest;
