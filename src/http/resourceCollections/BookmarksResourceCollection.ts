import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';
import buildQuery from 'odata-query';

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

    queryBookmarks(appKey: string): string {
        const baseUrl = this.bookmarks();

        const odataQuery = buildQuery({
            filter: {
                appKey: appKey,
            },
        });
        return `${baseUrl}${odataQuery}`;
    }
}
