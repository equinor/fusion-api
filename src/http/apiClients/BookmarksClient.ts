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

    protected createUrl(href: string, params?: Record<string, string>): string {
        params = { ['api-version']: '1.0-preview', ...params };
        const url = new URL(href);
        Object.keys(params).forEach((p) => url.searchParams.append(p, params![p]));
        return url.toString();
    }

    public getBookmark(bookmarkId: string) {
        const baseUrl = this.resourceCollections.bookmarks.bookmark(bookmarkId);
        const url = this.createUrl(baseUrl);
        return this.httpClient.getAsync<BookmarkResponse, FusionApiHttpErrorResponse>(url);
    }

    public async getBookmarks(appKey: string) {
        const baseUrl = this.resourceCollections.bookmarks.queryBookmarks(appKey);
        const url = this.createUrl(baseUrl);
        return this.httpClient.getAsync<BookmarkListResponse[], FusionApiHttpErrorResponse>(url);
    }

    public addBookmark(bookmark: BookmarkRequest) {
        const baseUrl = this.resourceCollections.bookmarks.addBookmark();
        const url = this.createUrl(baseUrl);
        return this.httpClient.postAsync<
            BookmarkRequest,
            BookmarkResponse,
            FusionApiHttpErrorResponse
        >(url, bookmark);
    }

    public updateBookmark(bookmarkId: string, bookmark: BookmarkPatchRequest) {
        const baseUrl = this.resourceCollections.bookmarks.updateBookmark(bookmarkId);
        const url = this.createUrl(baseUrl);
        return this.httpClient.patchAsync<
            BookmarkPatchRequest,
            BookmarkResponse,
            FusionApiHttpErrorResponse
        >(url, bookmark);
    }

    public deleteBookmark(bookmarkId: string) {
        const baseUrl = this.resourceCollections.bookmarks.deleteBookmark(bookmarkId);
        const url = this.createUrl(baseUrl);
        return this.httpClient.deleteAsync<void, FusionApiHttpErrorResponse>(url);
    }

    public applyBookmark(bookmarkId: string) {
        const baseUrl = this.resourceCollections.bookmarks.applyBookmark(bookmarkId);
        const url = this.createUrl(baseUrl);
        return this.httpClient.getAsync<BookmarkPayloadResponse, FusionApiHttpErrorResponse>(url);
    }

    public addToFavourites(bookmark: BookmarkFavouriteRequest) {
        const baseUrl = this.resourceCollections.bookmarks.addFavouriteBookmark();
        const url = this.createUrl(baseUrl);
        return this.httpClient.postAsync<
            BookmarkFavouriteRequest,
            void,
            FusionApiHttpErrorResponse
        >(url, bookmark);
    }

    public deleteFavouriteBookmark(bookmarkId: string) {
        const baseUrl = this.resourceCollections.bookmarks.deleteFavoriteBookmark(bookmarkId);
        const url = this.createUrl(baseUrl);
        return this.httpClient.deleteAsync<void, FusionApiHttpErrorResponse>(url);
    }

    public headBookmark(bookmarkId: string) {
        const baseUrl = this.resourceCollections.bookmarks.headBookmark(bookmarkId);
        const url = this.createUrl(baseUrl);
        return this.httpClient.headAsync<void, FusionApiHttpErrorResponse>(url);
    }
}

export default BookmarksClient;
