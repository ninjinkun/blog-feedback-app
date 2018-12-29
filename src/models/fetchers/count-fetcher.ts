import fetchJsonp from 'fetch-jsonp';
import sum from 'lodash/sum';
import { CountType } from '../../consts/count-type';
import { HatenaStarReponse } from '../../consts/fetch-response/hatena-star';
import { CountResponse } from '../responses';
import { crossOriginFetch } from './cross-origin-fetch';

export async function fetchHatenaBookmarkCounts(urls: string[]): Promise<CountResponse[]> {
  const apiUrl: string =
    'https://b.hatena.ne.jp/entry.counts?' + urls.map((i: string) => `url=${encodeURIComponent(i)}`).join('&');
  const response = await fetchJsonp(apiUrl);
  const json = await response.json();
  return Object.keys(json).map(
    (url): CountResponse => {
      return { url, count: json[url], type: CountType.HatenaBookmark };
    }
  );
}

export function fetchFacebookCounts(urls: string[]): Array<Promise<CountResponse>> {
  return urls.map(url => fetchFacebookCount(url));
}

export async function fetchFacebookCount(url: string): Promise<CountResponse> {
  const response = await fetch(`https://graph.facebook.com/?id=${encodeURIComponent(url)}`);
  const json = await response.json();
  if (json.hasOwnProperty('share')) {
    return { url: json.id, count: json.share.share_count, type: CountType.Facebook };
  } else {
    throw new Error('Facebook count fetch failed: ' + url);
  }
}

export async function fetchHatenaStarCounts(urls: string[]): Promise<CountResponse[]> {
  const apiURL = 'https://s.hatena.com/entry.json?' + urls.map(url => `uri=${encodeURIComponent(url)}`).join('&');
  const response = await crossOriginFetch(apiURL);
  const json: HatenaStarReponse = JSON.parse(response.data.body);
  return json.entries.map(({ uri, stars, colored_stars }) => ({
    url: uri,
    count: (stars && stars.length + sum(colored_stars && colored_stars.map(c => c.stars.length))) || 0,
    type: CountType.HatenaStar,
  }));
}

export async function fetchPocketCount(url: string): Promise<CountResponse> {
  const apiURL = `https://widgets.getpocket.com/v1/button?label=pocket&count=vertical&v=1&url=${encodeURIComponent(
    url
  )}`;
  const response = await fetch(apiURL);
  const htmlText = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const result = doc.evaluate(`'//em[@id="cnt"]/text()`, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  const count = (result.singleNodeValue as CharacterData).data;

  return { url, count: parseInt(count, 10), type: CountType.Pocket };
}
