import { BlogResponse, ItemResponse } from './responses';
import { FeedType } from '../consts/feed-type';
import { HTMLStringResponse } from '../consts/yahoo-api/html-string';
import { AtomResponse } from '../consts/yahoo-api/atom';
import { RSSResponse } from '../consts/yahoo-api/rss';

export async function fetchBlog(blogURL: string): Promise<BlogResponse> {
  const response = await fetch(`https://query.yahooapis.com/v1/public/yql?format=json&q=${encodeURIComponent(`select * from htmlstring where url = '${blogURL}'`)}&env=${encodeURIComponent('store://datatables.org/alltableswithkeys')}`);
  const json: HTMLStringResponse = await response.json();
  const results = json.query.results;

  if (!results) {
    throw new Error('Blog not found');
  } else {
    const htmlText = results.result;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const snapshots = doc.evaluate(`/html/head/link[@rel='alternate']`, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    // prefer Atom than RSS
    let type: FeedType | undefined;
    let href: string | undefined;
    for (let i = 0; i < snapshots.snapshotLength; i++) {
      const item = snapshots.snapshotItem(i) as HTMLAnchorElement;
      if (item) {
        switch (item.type) {
          case 'application/atom+xml':
            href = item.href;
            type = FeedType.Atom;
            break;
          case 'application/rss+xml':
            href = item.href;
            type = FeedType.RSS;
            break;
          default:
            break;
        }
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
      feedURL: href,
      feedType: type
    };
  }
}

export async function fetchAtom(atomUrl: string): Promise<ItemResponse[]> {
  const response = await fetch('https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent('select * from atom(100) where url = \'' + atomUrl + '\''));
  const json: AtomResponse = await response.json();
  const results = json.query.results;
  if (results) {
    return results.entry
      .map((entry): ItemResponse => {
        const { title, link, published } = entry;
        return { title, url: link[0].href, published: new Date(published) };
      });
  } else {
    throw new Error('Invalid Atom feed');
  }
}

export async function fetchRss(rssUrl: string): Promise<ItemResponse[]> {
  const response = await fetch('https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent('select * from rss(100) where url = \'' + rssUrl + '\''));
  const json: RSSResponse = await response.json();
  const results = json.query.results;
  if (results) {
    return results.item
      .map((item): ItemResponse => {
        const { title, link, pubDate } = item;
        return { title, url: link, published: new Date(pubDate) };
      });
  } else {
    throw new Error('Invalid RSS feed');
  }
}
