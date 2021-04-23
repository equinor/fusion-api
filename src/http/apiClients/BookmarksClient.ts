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

    async updateBookmark(bookmarkId: string, bookmark: Partial<BookmarkRequest>) {
        const url = this.resourceCollections.bookmarks.updateBookmark(bookmarkId);

        return await this.httpClient.patchAsync<
            Partial<Omit<BookmarkRequest, 'appKey' | 'contextId'>>,
            BookmarkResponse,
            FusionApiHttpErrorResponse
        >(url, bookmark);
    }

    async deleteBookmark(bookmarkId: string) {
        const url = this.resourceCollections.bookmarks.deleteBookmark(bookmarkId);
        return await this.httpClient.deleteAsync<void, FusionApiHttpErrorResponse>(url);
    }
}

export default BookmarksClient;
