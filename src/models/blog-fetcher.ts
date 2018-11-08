import { BlogResponse } from './responses';
import { FeedType } from '../consts/feed-type';
import { HTMLStringResponse } from '../consts/yahoo-api/html-string';

export async function fetchBlog(blogURL: string): Promise<BlogResponse> {
  const q = `select * from htmlstring where url = '${blogURL}'`;
  const response = await fetch(`https://query.yahooapis.com/v1/public/yql?format=json&q=${encodeURIComponent(q)}&env=${encodeURIComponent('store://datatables.org/alltableswithkeys')}`);
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
    if (!href) {
      throw new Error('Feed not found: ' + blogURL);
    }
    if (!type) {
      throw new Error('Feed type unknown: ' + blogURL);
    }
    return {
      title: doc.title,
      url: blogURL,
      feedURL: feedURL(href, blogURL),
      feedType: type
    };
  }
}

function feedURL(parsedFeedURL: string, baseURL: string) {
  const { host, protocol } = new URL(baseURL);
  const { pathname, search } = new URL(parsedFeedURL);    
  return `${protocol}//${host}${pathname}${search}`;
}

