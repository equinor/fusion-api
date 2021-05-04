import BookmarkResponse from './BookmarkResponse';

export type BookmarkListResponse = Omit<BookmarkResponse, 'payload'>;

export default BookmarkListResponse;
