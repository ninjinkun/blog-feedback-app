import { sum } from 'lodash';
import { CountType } from '../../consts/count-type';
import { HatenaStarReponse } from '../../consts/fetch-response/hatena-star';
import { CountResponse } from '../../responses';
import { crossOriginFetch } from '../functions';

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
