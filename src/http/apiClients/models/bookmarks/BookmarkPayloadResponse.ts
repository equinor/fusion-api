import BookmarkResponse from './BookmarkResponse';

export type BookmarkPayloadResponse = Pick<BookmarkResponse, 'id' | 'context' | 'payload'>;

export default BookmarkPayloadResponse;
