import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';
import buildQuery, { Filter as OdataFilter } from 'odata-query';

export default class BookmarksResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return this.serviceResolver.getBookmarksBaseUrl();
    }

    bookmark(bookmarkId: string): string {
        return combineUrls(this.getBaseUrl(), 'bookmarks', bookmarkId);
    }
    bookmarks(): string {
        return combineUrls(this.getBaseUrl(), 'persons', 'me', 'bookmarks');
    }

    addBookmark(): string {
        return combineUrls(this.getBaseUrl(), 'bookmarks');
    }

    deleteBookmark(bookmarkId: string): string {
        return combineUrls(this.getBaseUrl(), 'bookmarks', bookmarkId);
    }

    updateBookmark(bookmarkId: string): string {
        return combineUrls(this.getBaseUrl(), 'bookmarks', bookmarkId);
    }

    applyBookmark(bookmarkId: string): string {
        return combineUrls(this.getBaseUrl(), 'bookmarks', bookmarkId, 'apply');
    }

    addFavouriteBookmark(): string {
        return combineUrls(this.getBaseUrl(), 'persons', 'me', 'bookmarks', 'favourites');
    }

    deleteFavoriteBookmark(bookmarkId: string): string {
        return combineUrls(
            this.getBaseUrl(),
            'persons',
            'me',
            'bookmarks',
            'favourites',
            bookmarkId
        );
    }

    headBookmark(bookmarkId: string): string {
        return combineUrls(
            this.getBaseUrl(),
            'persons',
            'me',
            'bookmarks',
            'favourites',
            bookmarkId
        );
    }

    queryBookmarks(filter: { appkey: string } & OdataFilter): string {
        const baseUrl = this.bookmarks();
        const odataQuery = buildQuery({ filter });
        return `${baseUrl}${odataQuery}`;
    }
}
