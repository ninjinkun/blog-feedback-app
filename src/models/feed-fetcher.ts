import { BlogResponse, ItemResponse } from './responses';
import { FeedType } from '../consts/feed-type';

export async function fetchBlog(blogURL: string): Promise<BlogResponse | undefined> {
  const response = await fetch('https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent('select * from htmlstring where url = \'' + blogURL + '\'') + '&env=' + encodeURIComponent('store://datatables.org/alltableswithkeys'));
  const json: YahooAPIs.HTMLString.Response = await response.json();
  const results = json.query.results;

  if (!results) {
    return undefined;
  } else {
    const htmlText = results.result;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const snapshots = doc.evaluate('/html/head/link[@rel=\'alternate\']', doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    // prefer Atom than RSS
    let type: FeedType | undefined;
    let href: string | undefined;
    for (let i = 0; i < snapshots.snapshotLength || type === FeedType.Atom; i++) {
      const item = snapshots.snapshotItem(i) as HTMLAnchorElement;
      href = item.href;
      switch (item.type) {
        case 'application/atom+xml':
          type = FeedType.Atom;
          break;
        case 'application/rss+xml':
          type = FeedType.RSS;
          break;
        default:
          break;
      }
    }
    if (!href) {
      throw new Error('Feed not found: ' + blogURL);
    }
    if (!type) {
      throw new Error('Feed type unknown: ' + blogURL);
    }
    return {
      title: doc.title,
      url: blogURL,
      feedUrl: href,
      feedType: type
    };
  }
}

export async function fetchAtom(atomUrl: string): Promise<ItemResponse[] | undefined> {
  const response = await fetch('https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent('select * from atom(100) where url = \'' + atomUrl + '\''));
  const json: YahooAPIs.Atom.Response = await response.json();
  const results = json.query.results;
  if (results) {
    return results.entry
      .map((entry): ItemResponse => { 
        const { title, link, published } = entry;
        return { title, url: link[0].href, published: new Date(published) };
    });
  } else {
    return undefined;
  }
}

export async function fetchRss(rssUrl: string): Promise<ItemResponse[] | undefined> {
  const response = await fetch('https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent('select * from rss(100) where url = \'' + rssUrl + '\''));
  const json: YahooAPIs.RSS.Response = await response.json();
  const results = json.query.results;
  if (results) {
    return results.item
      .map((item): ItemResponse => { 
        const { title, link, pubDate } = item;
        return { title, url: link, published: new Date(pubDate) };
  });
  } else {
    return undefined;
  }
}

namespace YahooAPIs {
  export namespace Atom {
    export type Response = {
      query: Query;
      created: Date;
      count: number;
      lang: string;
    };
    export type Query = {
      results: Results | null;
    };
    export type Results = {
      entry: Entry[];
    };
    export type Entry = {
      title: string;
      link: Link[];
      published: string;
    };
    export type Link = {
      href: string;
    };
  }

  export namespace RSS {
    export type Response = {
      query: Query;
      created: Date;
      count: number;
      lang: string;
    };
    export type Query = {
      results: Results | null;
    };
    export type Results = {
      item: Item[];
    };
    export type Item = {
      title: string;
      link: string;
      pubDate: string;
    };
  }

  export namespace HTMLString {
    export type Response = {
      query: Query;
      created: string;
      count: number;
      lang: string;
    };
    export type Query = {
      results: Results | null;
    };
    export type Results = {
      result: string;
    };
  }
}
