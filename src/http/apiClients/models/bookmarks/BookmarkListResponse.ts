import BookmarkResponse from './BookmarkResponse';

type BookmarkListResponse = Omit<BookmarkResponse, 'payload'>;

export default BookmarkListResponse;
