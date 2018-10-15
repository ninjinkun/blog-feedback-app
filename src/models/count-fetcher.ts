import fetchJsonp from 'fetch-jsonp';
import { CountResponse } from './responses';
import { CountType } from '../consts/count-type';

export async function fetchHatenaBookmarkCounts(urls: string[]): Promise<CountResponse[]> {
  const apiUrl: string = 'http://api.b.st-hatena.com/entry.counts?' + urls.map((i: string) => 'url=' + encodeURIComponent(i)).join('&');
  const response = await fetchJsonp(apiUrl);
  const json = await response.json();
  return Object.keys(json).map((url): CountResponse => { 
      return { url: url, count: json[url], type: CountType.HatenaBookmark };
    });
}

export function fetchFacebookCounts(urls: string[]): Promise<CountResponse>[] {
  return urls.map((url) => fetchFacebookCount(url));
}

async function fetchFacebookCount(url: string): Promise<CountResponse> {
  const response = await fetch('https://graph.facebook.com/?id=' + encodeURIComponent(url));
  const json = await response.json();
  if (json.hasOwnProperty('share')) {
    return { url: json.id, count: json.share.share_count, type: CountType.Facebook};
  } else {
    throw new Error('Facebook count fetch failed: ' + url);
  }
}
