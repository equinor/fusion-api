import BookmarkRequest from './BookmarkRequest';

type BookmarkPatchRequest = Partial<Omit<BookmarkRequest, 'appKey' | 'contextId'>>;

export default BookmarkPatchRequest;
