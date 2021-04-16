import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from '.';
import { Bookmark } from './models/bookmarks/Bookmark';

export class BookmarksClient extends BaseApiClient {
    protected getBaseUrl(): string {
        return this.serviceResolver.getFusionBaseUrl();
    }

    async getBookmark(bookmarkId: string) {
        const url = this.resourceCollections.bookmarks.bookmark(bookmarkId);
        return await this.httpClient.getAsync<any, FusionApiHttpErrorResponse>(url);
    }

    async addBookmark(bookmark: Bookmark) {
        const url = this.resourceCollections.bookmarks.addBookmark();
        return await this.httpClient.postAsync<Bookmark, Bookmark, FusionApiHttpErrorResponse>(
            url,
            bookmark
        );
    }
}

export default BookmarksClient;
