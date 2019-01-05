import { sum } from 'lodash';
import { CountType } from '../../consts/count-type';
import { HatenaStarReponse } from '../../consts/fetch-response/hatena-star';
import { CountResponse } from '../../responses';
import axios from 'axios';

export async function fetchHatenaStarCounts(urls: string[]): Promise<CountResponse[]> {
  const apiURL = 'https://s.hatena.com/entry.json?' + urls.map(url => `uri=${encodeURIComponent(url)}`).join('&');
  const response = await axios.get(apiURL);
  const json: HatenaStarReponse = response.data;
  return json.entries.map(({ uri, stars, colored_stars }) => ({
    url: uri,
    count: (stars && stars.length + sum(colored_stars && colored_stars.map(c => c.stars.length))) || 0,
    type: CountType.HatenaStar,
  }));
}
