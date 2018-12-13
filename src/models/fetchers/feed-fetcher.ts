import firebase from 'firebase/app';
import 'firebase/functions';
import xmljs from 'xml-js';
import { Atom } from '../../consts/feeds/atom';
import { Feed } from '../../consts/feeds/feed';
import { RSS1 } from '../../consts/feeds/rss1';
import { RSS2 } from '../../consts/feeds/rss2';
import { ItemResponse } from '../responses';

export async function fetchFeed(feedURL: string): Promise<ItemResponse[]> {
  const fetchFeed = firebase
    .app()
    .functions('asia-northeast1')
    .httpsCallable('crossOriginFetch');
  const response = await fetchFeed({ url: feedURL });
  const xml = response.data.body;
  const json = xmljs.xml2js(xml, { compact: true }) as Feed;

  if ('feed' in json) {
    return handleAtom(json);
  } else if ('rdf:RDF' in json) {
    return handleRSS1(json);
  } else if ('rss' in json) {
    return handleRSS2(json);
  } else {
    throw new Error('Invalid Atom feed');
  }

  function handleAtom(atom: Atom) {
    return atom.feed.entry.map(
      (entry): ItemResponse => {
        const { title, link, published, updated } = entry;
        const url = (() => {
          if (link instanceof Array) {
            const relLinks = link.filter(l => l._attributes.rel && l._attributes.rel === 'alternate');
            return (relLinks.length && relLinks[0]._attributes.href) || link[0]._attributes.href;
          } else {
            return link._attributes.href;
          }
        })();
        return {
          title: title._text,
          url,
          published: new Date((published && published._text) || updated._text),
        };
      }
    );
  }

  function handleRSS1(rss1: RSS1) {
    return rss1['rdf:RDF'].item.map(
      (item): ItemResponse => {
        const { title, link, 'dc:date': date } = item;
        return { title: title._text, url: link._text, published: new Date(date._text) };
      }
    );
  }

  function handleRSS2(rss2: RSS2) {
    return rss2.rss.channel.item.map(
      (item): ItemResponse => {
        const { title, link, pubDate } = item;
        return { title: title._text, url: link._text, published: new Date(pubDate._text) };
      }
    );
  }
}
