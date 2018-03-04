import { BlogResponse, ItemResponse, FEED_TYPE_RSS, FEED_TYPE_ATOM } from './responses';

class FeedFetcher {    
  // Return Promise<BlogResponse>
  static async fetchBlog(blogURL) {
    const response = await fetch(blogURL);
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");        
    const snapshots = doc.evaluate("/html/head/link[@rel='alternate']", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    // prefer Atom than RSS
    let type, href;
    for (let i = 0; i < snapshots.snapshotLength || type === FEED_TYPE_ATOM; i++) {
      const item = snapshots.snapshotItem(i);
      href = item.href;                                  
      switch(item.type) {            
        case 'application/atom+xml':
          type = FEED_TYPE_ATOM;
          break;
        case 'application/rss+xml':
          type = FEED_TYPE_RSS;
          break;
        default:
          break;
      }
    }
    if (!href) {
      throw new Error("Feed not found: " + blogURL);
    }
    return new BlogResponse({ title: doc.title, url: blogURL, feedUrl: href, feedType: type });
  }

  // Return Promise<ItemResponse>
  static async fetchAtom(atomUrl) {
    const response = await fetch('https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent('select * from atom(100) where url = \'' + atomUrl + '\''))
    const json = await response.json()
    return json.query.results.entry
      .map((entry) => new ItemResponse({ title: entry.title, url: entry.link[0].href, published: entry.published }));
  }

  // Return Promise<ItemResponse>
  static async fetchRss(rssUrl) {
    const response = await fetch('https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent('select * from rss(100) where url = \'' + rssUrl + '\''));
    const json = await response.json()
    return json.query.results.item
      .map((item) => new ItemResponse({ title: item.title, url: item.link, published: item.pubDate }));
  }
}

export default FeedFetcher;
