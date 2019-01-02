import xmljs from 'xml-js';
import { FeedType } from '../consts/feed-type';
import { Atom, Link } from '../consts/feeds/atom';
import { Feed } from '../consts/feeds/feed';
import { RSS1 } from '../consts/feeds/rss1';
import { RSS2 } from '../consts/feeds/rss2';
import { FeedResponse, ItemResponse } from '../responses';
import { crossOriginFetch } from './functions';

export async function fetchFeed(feedURL: string): Promise<FeedResponse> {
  const response = await crossOriginFetch(feedURL);
  const xml = response.data.body;
  const sanitizedXML = xml.replace(/(?:<content)[\s\S]*?(?:<\/content>)/g, '');
  try {
    const json = xmljs.xml2js(sanitizedXML, {
      compact: true,
    }) as Feed;
    if ('feed' in json) {
      return handleAtom(json);
    } else if ('rdf:RDF' in json) {
      return handleRSS1(json);
    } else if ('rss' in json) {
      return handleRSS2(json);
    } else {
      throw new Error('Invalid Atom feed');
    }
  } catch (e) {
    throw new Error('Invalid XML Feed' + e);
  }
}

function handleAtom(atom: Atom): FeedResponse {
  const items = atom.feed.entry.map(
    (entry): ItemResponse => {
      const { title, link, published, updated, 'feedburner:origLink': feedburnerLink } = entry;
      const url = (() => {
        if (feedburnerLink) {
          return feedburnerLink._text;
        } else {
          return handleAtomLink(link);
        }
      })();
      const item = {
        title: ('_cdata' in title && title._cdata) || ('_text' in title && title._text) || '',
        url,
        published: new Date((published && published._text) || updated._text),
      };
      return item;
    }
  );
  return {
    title: atom.feed.title._text,
    url: handleAtomLink(atom.feed.link),
    feedType: FeedType.Atom,
    items,
  };
}

function handleRSS1(rss1: RSS1): FeedResponse {
  const { 'rdf:RDF': rdf } = rss1;
  const items = rdf.item.map(
    (item): ItemResponse => {
      const { title, link, 'dc:date': date } = item;
      return { title: title._text, url: link._text, published: new Date(date._text) };
    }
  );
  return {
    title: rdf.channel.title._text,
    url: rdf.channel.link._text,
    feedType: FeedType.RSS,
    items,
  };
}

function handleRSS2(rss2: RSS2): FeedResponse {
  const items = rss2.rss.channel.item.map(
    (item): ItemResponse => {
      const { title, link, pubDate } = item;
      return {
        title: title._cdata || title._text,
        url: normalizeMediumURL(link._text),
        published: new Date(pubDate._text),
      };
    }
  );
  return {
    title: rss2.rss.channel.title._cdata || rss2.rss.channel.title._text,
    url: normalizeMediumURL(rss2.rss.channel.link._text),
    items,
    feedType: FeedType.RSS,
  };
}

function normalizeMediumURL(url: string) {
  return url.replace(/\?source=([^&]+)/, '');
}

function handleAtomLink(link: Link | Link[]): string {
  if (link instanceof Array) {
    const relLinks = link.filter(l => l._attributes.rel && l._attributes.rel === 'alternate');
    return (relLinks.length && relLinks[0]._attributes.href) || link[0]._attributes.href;
  } else {
    return link._attributes.href;
  }
}
