import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';

export default class BookmarksResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return this.serviceResolver.getBookmarksBaseUrl();
    }

    bookmark(bookmarkId: string): string {
        return combineUrls(this.getBaseUrl(), 'bookmarks', bookmarkId);
    }

    addBookmark(): string {
        return combineUrls(this.getBaseUrl(), 'bookmarks');
    }
}
