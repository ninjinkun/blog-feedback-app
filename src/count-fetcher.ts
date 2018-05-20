import fetchJsonp from 'fetch-jsonp';
import { CountResponse, HatenaBookmarkCountResponse, FacebookCountResponse } from './responses';

export async function fetchHatenaBookmarkCounts(urls: string[]): Promise<HatenaBookmarkCountResponse[]> {
  const apiUrl: string = 'http://api.b.st-hatena.com/entry.counts?' + urls.map((i: string) => 'url=' + encodeURIComponent(i)).join('&');
  const response = await fetchJsonp(apiUrl);
  const json = await response.json();
  return Object.keys(json).map((url) => new HatenaBookmarkCountResponse(url, json[url]));
}

export function fetchFacebookCounts(urls: string[]): Promise<FacebookCountResponse>[] {
  return urls.map((url) => fetchFacebookCount(url));
}

async function fetchFacebookCount(url: string): Promise<FacebookCountResponse> {
  const response = await fetch('https://graph.facebook.com/?id=' + encodeURIComponent(url));
  const json = await response.json();
  if (json.hasOwnProperty('share')) {
    return new FacebookCountResponse(json.id, json.share.share_count);
  } else {
    throw new Error('Facebook count fetch failed: ' + url);
  }
}
