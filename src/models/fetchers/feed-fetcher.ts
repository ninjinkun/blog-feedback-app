import * as firebase from 'firebase';
import xmljs from 'xml-js';
import { Atom } from '../../consts/feeds/atom';
import { Feed } from '../../consts/feeds/feed';
import { RSS1 } from '../../consts/feeds/rss1';
import { RSS2 } from '../../consts/feeds/rss2';
import { ItemResponse } from '../responses';

export async function fetchFeed(feedURL: string): Promise<ItemResponse[]> {
  const fetchFeed = firebase.functions().httpsCallable('crossOriginFetch');
  const response = await fetchFeed({ url: feedURL });
  const xml = response.data.body;
  const json = xmljs.xml2js(xml, { compact: true }) as Feed;

  if ('feed' in json) {
    const atom: Atom = json;
    return atom.feed.entry.map(
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
  } else if ('rdf:RDF' in json) {
    const rss1: RSS1 = json;
    return rss1['rdf:RDF'].item.map(
      (item): ItemResponse => {
        const { title, link, 'dc:date': date } = item;
        return { title: title._text, url: link._text, published: new Date(date._text) };
      }
    );
  } else if ('rss' in json) {
    const rss2: RSS2 = json;
    return rss2.rss.channel.item.map(
      (item): ItemResponse => {
        const { title, link, pubDate } = item;
        return { title: title._text, url: link._text, published: new Date(pubDate._text) };
      }
    );
  } else {
    throw new Error('Invalid Atom feed');
  }
}
