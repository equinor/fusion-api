import BookmarkResponse from './BookmarkResponse';

type BookmarkPayloadResponse = Pick<BookmarkResponse, 'id' | 'context' | 'payload'>;

export default BookmarkPayloadResponse;
