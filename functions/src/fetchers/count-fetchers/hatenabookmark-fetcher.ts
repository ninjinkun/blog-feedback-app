import axios from 'axios';
import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';

export async function fetchHatenaBookmarkCounts(urls: string[]): Promise<CountResponse[]> {
  const apiUrl: string =
    'https://b.hatena.ne.jp/entry.counts?' + urls.map((i: string) => `url=${encodeURIComponent(i)}`).join('&');
  const response = await axios.get(apiUrl);
  const json = response.data;
  return Object.keys(json).map(
    (url): CountResponse => {
      return { url, count: json[url], type: CountType.HatenaBookmark };
    }
  );
}
