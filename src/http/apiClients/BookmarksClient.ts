import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from '.';
import BookmarkResponse from './models/bookmarks/BookmarkResponse';
import BookmarkListResponse from './models/bookmarks/BookmarkListResponse';
import BookmarkRequest from './models/bookmarks/BookmarkRequest';
import {
    BookmarkFavouriteRequest,
    BookmarkPatchRequest,
    BookmarkPayloadResponse,
} from './models/bookmarks';

export class BookmarksClient extends BaseApiClient {
    protected getBaseUrl(): string {
        return this.serviceResolver.getFusionBaseUrl();
    }

    async getBookmark(bookmarkId: string) {
        const baseUrl = this.resourceCollections.bookmarks.bookmark(bookmarkId);
        const url = `${baseUrl}?api-version=1.0-preview`;
        return await this.httpClient.getAsync<BookmarkResponse, FusionApiHttpErrorResponse>(url);
    }
    async getBookmarks(appKey: string) {
        const baseUrl = this.resourceCollections.bookmarks.queryBookmarks(appKey);
        const url = `${baseUrl}&api-version=1.0-preview`;
        return await this.httpClient.getAsync<BookmarkListResponse[], FusionApiHttpErrorResponse>(
            url
        );
    }

    async addBookmark(bookmark: BookmarkRequest) {
        const baseUrl = this.resourceCollections.bookmarks.addBookmark();
        const url = `${baseUrl}?api-version=1.0-preview`;
        return await this.httpClient.postAsync<
            BookmarkRequest,
            BookmarkResponse,
            FusionApiHttpErrorResponse
        >(url, bookmark);
    }

    async updateBookmark(bookmarkId: string, bookmark: BookmarkPatchRequest) {
        const baseUrl = this.resourceCollections.bookmarks.updateBookmark(bookmarkId);
        const url = `${baseUrl}?api-version=1.0-preview`;
        return await this.httpClient.patchAsync<
            BookmarkPatchRequest,
            BookmarkResponse,
            FusionApiHttpErrorResponse
        >(url, bookmark);
    }

    async deleteBookmark(bookmarkId: string) {
        const baseUrl = this.resourceCollections.bookmarks.deleteBookmark(bookmarkId);
        const url = `${baseUrl}?api-version=1.0-preview`;
        return await this.httpClient.deleteAsync<void, FusionApiHttpErrorResponse>(url);
    }

    async applyBookmark(bookmarkId: string) {
        const baseUrl = this.resourceCollections.bookmarks.applyBookmark(bookmarkId);
        const url = `${baseUrl}?api-version=1.0-preview`;
        return await this.httpClient.getAsync<BookmarkPayloadResponse, FusionApiHttpErrorResponse>(
            url
        );
    }
    async addToFavourites(bookmark: BookmarkFavouriteRequest) {
        const baseUrl = this.resourceCollections.bookmarks.addFavouriteBookmark();
        const url = `${baseUrl}?api-version=1.0-preview`;
        return await this.httpClient.postAsync<
            BookmarkFavouriteRequest,
            void,
            FusionApiHttpErrorResponse
        >(url, bookmark);
    }

    async deleteFavouriteBookmark(bookmarkId: string) {
        const baseUrl = this.resourceCollections.bookmarks.deleteFavoriteBookmark(bookmarkId);
        const url = `${baseUrl}?api-version=1.0-preview`;
        return await this.httpClient.deleteAsync<void, FusionApiHttpErrorResponse>(url);
    }

    async headBookmark(bookmarkId: string) {
        const baseUrl = this.resourceCollections.bookmarks.headBookmark(bookmarkId);
        const url = `${baseUrl}?api-version=1.0-preview`;
        return await this.httpClient.headAsync<void, FusionApiHttpErrorResponse>(url);
    }
}

export default BookmarksClient;
