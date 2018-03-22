import { BlogResponse, ItemResponse, FEED_TYPE_RSS, FEED_TYPE_ATOM } from './responses';

class FeedFetcher {
  // Return Promise<BlogResponse>
  static async fetchBlog(blogURL: string): Promise<BlogResponse> {
    const response = await fetch(blogURL);
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const snapshots = doc.evaluate('/html/head/link[@rel=\'alternate\']', doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    // prefer Atom than RSS
    let type = '', href;
    for (let i = 0; i < snapshots.snapshotLength || type === FEED_TYPE_ATOM; i++) {
      const item = snapshots.snapshotItem(i) as HTMLAnchorElement;
      href = item.href;
      switch (item.type) {
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
      throw new Error('Feed not found: ' + blogURL);
    }
    return new BlogResponse(doc.title, blogURL, href, type);
  }

  // Return Promise<ItemResponse>
  static async fetchAtom(atomUrl: string): Promise<ItemResponse[]> {
    const response = await fetch('https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent('select * from atom(100) where url = \'' + atomUrl + '\''));
    const json = await response.json();
    return json.query.results.entry
      .map((entry: YahooAPIs.Atom.Entry) => new ItemResponse(entry.title, entry.link[0].href, entry.published));
  }

  // Return Promise<ItemResponse>
  static async fetchRss(rssUrl: string): Promise<ItemResponse[]> {
    const response = await fetch('https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent('select * from rss(100) where url = \'' + rssUrl + '\''));
    const json = await response.json();
    return json.query.results.item
      .map((item: YahooAPIs.RSS.Item) => new ItemResponse(item.title, item.link, item.pubDate));
  }
}

export namespace YahooAPIs {
  export namespace Atom {
    export interface Link {
      href: string;
    }
    export interface Entry {
      title: string;
      link: Link[];
      published: Date;
    }
  }

  export namespace RSS {
    export interface Item {
      title: string;
      link: string;
      pubDate: Date;
    }
  }
}

export default FeedFetcher;
