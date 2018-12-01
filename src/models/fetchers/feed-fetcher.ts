import * as firebase from 'firebase';
import xmljs from 'xml-js';
import { FeedType } from '../../consts/feed-type';
import { Atom } from '../../consts/xml-js/atom';
import { RSS } from '../../consts/xml-js/rss';
import { ItemResponse } from '../responses';

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

export async function fetchAtom(atomURL: string): Promise<ItemResponse[]> {
  const fetchFeed = firebase.functions().httpsCallable('crossOriginFetch');
  const response = await fetchFeed({ url: atomURL });
  const xml = response.data.body;
  const json = xmljs.xml2js(xml, { compact: true }) as Atom;
  if (json) {
    return json.feed.entry.map(
      (entry): ItemResponse => {
        const { title, link, published, updated } = entry;
        const url = link instanceof Array ? link[0] : link;
        return {
          title: title._text,
          url: url._attributes.href,
          published: new Date((published && published._text) || updated._text),
        };
      }
    );
  } else {
    throw new Error('Invalid Atom feed');
  }
}

export async function fetchRss(rssURL: string): Promise<ItemResponse[]> {
  const fetchFeed = firebase.functions().httpsCallable('crossOriginFetch');
  const response = await fetchFeed({ url: rssURL });
  const xml = response.data.body;
  const json = xmljs.xml2js(xml, { compact: true }) as RSS;

  const rss1 = json['rdf:RDF'];
  const rss2 = json.rss;
  if (rss1) {
    return rss1.item.map(
      (item): ItemResponse => {
        const { title, link, 'dc:date': date } = item;
        return { title: title._text, url: link._text, published: new Date(date._text) };
      }
    );
  } else if (rss2) {
    return rss2.channel.item.map(
      (item): ItemResponse => {
        const { title, link, pubDate } = item;
        return { title: title._text, url: link._text, published: new Date(pubDate._text) };
      }
    );
  } else {
    throw new Error('Invalid RSS feed');
  }
}
