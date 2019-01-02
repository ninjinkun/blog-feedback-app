import fetchJsonp from 'fetch-jsonp';
import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';

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
