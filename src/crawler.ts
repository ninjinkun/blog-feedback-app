import FeedFetcher from './feed-fetcher';
import CountFetcher from './count-fetcher';
import { CountResponse, FEED_TYPE_ATOM, FEED_TYPE_RSS, ItemResponse } from './responses';
import { BlogResponse } from 'responses';

class Crawler {
  static crawl(blogURL: string): [Promise<BlogResponse>, Promise<ItemResponse[]>, Promise<CountResponse[]>] {
    const fetchBlog = FeedFetcher.fetchBlog(blogURL);
    const fetchFeed = this.fetchFeed(fetchBlog);
    const fetchCount = this.fetchCount(fetchFeed);
    return [fetchBlog, fetchFeed, fetchCount];
  }

  static async fetchFeed(fetchBlog: Promise<BlogResponse>): Promise<ItemResponse[]> {
    const blogResponse = await fetchBlog;
    switch (blogResponse.feedType) {
      case FEED_TYPE_ATOM:
        return FeedFetcher.fetchAtom(blogResponse.feedUrl);
      case FEED_TYPE_RSS:
        return FeedFetcher.fetchRss(blogResponse.feedUrl);
      default:
        throw new Error('Unknown feed type: ' + blogResponse.feedType);
    }
  }

  static async fetchCount(fetchFeed: Promise<ItemResponse[]>): Promise<CountResponse[]> {
    const itemsResponse = await fetchFeed;

    const fetchHatenaBookmark = CountFetcher.fetchHatenaBookmarkCounts(itemsResponse.map((item: ItemResponse) => item.url));
    const fetchFacebooks = CountFetcher.fetchFacebookCounts(itemsResponse.map((item: ItemResponse) => item.url));
    const promises: Promise<void | CountResponse | CountResponse[]>[] = ([] as Promise<CountResponse[] | CountResponse>[]).concat([fetchHatenaBookmark], fetchFacebooks).map((p) => p.catch((e: Error) => undefined)); // FIXME: ignore fetch error

    // 4 parallel fetch
    const chunk = 4;
    let countResponses: (void | CountResponse | CountResponse[])[] = [];
    for (let i = 0, j = promises.length; i < j; i += chunk) {
      countResponses = countResponses.concat(await Promise.all(promises.slice(i, i + chunk)));
    }
    // flatten
    return [].concat.apply([], countResponses).filter((c: CountResponse) => c instanceof CountResponse);
  }
}

export default Crawler;