import { FeedType } from '../consts/feed-type';
import { AtomResponse } from '../consts/yahoo-api/atom';
import { RSSResponse } from '../consts/yahoo-api/rss';
import { ItemResponse } from './responses';

export async function fetchFeed(feedType: FeedType, feedURL: string): Promise<ItemResponse[]> {
  switch (feedType) {
    case FeedType.Atom:
      return fetchAtom(feedURL);
    case FeedType.RSS:
      return fetchRss(feedURL);
    default:
      throw new Error(`Unknown feed type: ${feedType}`);
  }
}

export async function fetchUncertainnFeed(feedURL: string): Promise<ItemResponse[]> {
  try {
    return await fetchAtom(feedURL);
  } catch (e) {
    try {
      return await fetchRss(feedURL);
    } catch (e) {
      throw new Error('Invalid feed');
    }
  }
}

export async function fetchAtom(atomUrl: string): Promise<ItemResponse[]> {
  const response = await fetch(
    'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
      encodeURIComponent("select * from atom(100) where url = '" + atomUrl + "'")
  );
  const json: AtomResponse = await response.json();
  const results = json.query.results;
  if (results) {
    return results.entry.map(
      (entry): ItemResponse => {
        const { title, link, published, updated } = entry;
        return { title, url: link.href, published: new Date(published || updated) };
      }
    );
  } else {
    throw new Error('Invalid Atom feed');
  }
}

export async function fetchRss(rssUrl: string): Promise<ItemResponse[]> {
  const response = await fetch(
    'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
      encodeURIComponent("select * from rss(100) where url = '" + rssUrl + "'")
  );
  const json: RSSResponse = await response.json();
  const results = json.query.results;
  if (results) {
    return results.item.map(
      (item): ItemResponse => {
        const { title, link, pubDate } = item;
        return { title, url: link, published: new Date(pubDate) };
      }
    );
  } else {
    throw new Error('Invalid RSS feed');
  }
}
