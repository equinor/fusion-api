import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from '.';
import BookmarkResponse from './models/bookmarks/BookmarkResponse';
import BookmarkListResponse from './models/bookmarks/BookmarkListResponse';
import BookmarkRequest from './models/bookmarks/BookmarkRequest';

export class BookmarksClient extends BaseApiClient {
    protected getBaseUrl(): string {
        return this.serviceResolver.getFusionBaseUrl();
    }

    async getBookmark(bookmarkId: string) {
        const url = this.resourceCollections.bookmarks.bookmark(bookmarkId);
        return await this.httpClient.getAsync<BookmarkResponse, FusionApiHttpErrorResponse>(url);
    }
    async getBookmarks(appKey: string) {
        const url = this.resourceCollections.bookmarks.queryBookmarks(appKey);
        return await this.httpClient.getAsync<BookmarkListResponse[], FusionApiHttpErrorResponse>(
            url
        );
    }

    async addBookmark(bookmark: BookmarkRequest) {
        const url = this.resourceCollections.bookmarks.addBookmark();
        return await this.httpClient.postAsync<
            BookmarkRequest,
            BookmarkResponse,
            FusionApiHttpErrorResponse
        >(url, bookmark);
    }
}

export default BookmarksClient;
