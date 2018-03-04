export const FEED_TYPE_RSS = "rss";
export const FEED_TYPE_ATOM = "atom";

export const COUNT_TYPE_FACEBOOK = 'facebook'
export const COUNT_TYPE_HATENA_BOOKMARK = 'hatenabookmark'

export class BlogResponse {
  constructor({ title, url, feedUrl, feedType }) {
    Object.assign(this, { title, url, feedUrl, feedType });
  }
}

export class ItemResponse {
  constructor({ title, url, published }) {
    Object.assign(this, { title, url, published: new Date(published) });
  }
}

export class CountResponse {
  constructor({ url, count }) {
    Object.assign(this, { url, count });
  }
  get type() { console.log('should be override') }
}

export class HatenaBookmarkCountResponse extends CountResponse {
  get type() { return COUNT_TYPE_HATENA_BOOKMARK }
}

export class FacebookCountResponse extends CountResponse {
  get type() { return COUNT_TYPE_FACEBOOK }
}