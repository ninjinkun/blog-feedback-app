import axios from 'axios';
import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';

export async function fetchHatenaBookmarkCounts(urls: string[], maxFetchCount = 50): Promise<CountResponse[]> {
  const slicedURLs = urls.slice(0, maxFetchCount - 1);
  const apiUrl: string =
    'https://b.hatena.ne.jp/entry.counts?' + slicedURLs.map((i: string) => `url=${encodeURIComponent(i)}`).join('&');
  const response = await axios.get(apiUrl, { timeout: 10 * 1000 });
  const json = response.data;
  return Object.keys(json).map(
    (url): CountResponse => {
      return { url, count: json[url], type: CountType.HatenaBookmark };
    }
  );
}
