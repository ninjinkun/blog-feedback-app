import FeedFetcher from './feed-fetcher'
import CountFetcher from './count-fetcher'
import { CountResponse, FEED_TYPE_ATOM, FEED_TYPE_RSS } from './responses';

class Crawler {
  static crawl(blogURL) {
    const fetchBlog = FeedFetcher.fetchBlog(blogURL);
    const fetchFeed = this.fetchFeed(fetchBlog) 
    const fetchCount = this.fetchCount(fetchFeed);
    return [fetchBlog, fetchFeed, fetchCount]
  }

  static async fetchFeed(fetchBlog) {
    const blogResponse = await fetchBlog;
      switch(blogResponse.feedType) {
        case FEED_TYPE_ATOM:
          return FeedFetcher.fetchAtom(blogResponse.feedUrl);
        case FEED_TYPE_RSS:
          return FeedFetcher.fetchRss(blogResponse.feedUrl);
        default:
          throw new Error('Unknown feed type: ' + blogResponse.feedType);
        }
    }

  static async fetchCount(fetchFeed) {
    const itemsRespnse = await fetchFeed;

    const fetchHatenaBookmark = CountFetcher.fetchHatenaBookmarkCounts(itemsRespnse.map((item) => item.url));
    const fetchFacebooks = CountFetcher.fetchFacebookCounts(itemsRespnse.map((item) => item.url));
    const promises = [].concat([fetchHatenaBookmark], fetchFacebooks).map(p => p.catch(e =>  console.log(e) )); // FIXME: ignore fetch error
        
    // 4 parallel fetch
    const chunk = 4;
    let countResponses = [];
    for (let i = 0, j = promises.length; i < j; i+= chunk) {
        countResponses = countResponses.concat(await Promise.all(promises.slice(i, i + chunk)));
    }
    // flatten
    return [].concat.apply([], countResponses).filter(c => c instanceof CountResponse);
  }
}

export default Crawler