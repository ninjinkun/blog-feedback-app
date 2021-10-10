import { sum } from 'lodash';
import { CountType } from '../../consts/count-type';
import { HatenaStarReponse } from '../../consts/fetch-response/hatena-star';
import { CountResponse } from '../../responses';
import axios from 'axios';

export async function fetchHatenaStarCounts(urls: string[], maxFetchCount = 40): Promise<CountResponse[]> {
  const slicedURLs = urls.slice(0, maxFetchCount - 1);
  const apiURL = 'https://s.hatena.com/entry.json?' + slicedURLs.map(url => `uri=${encodeURIComponent(url)}`).join('&');
  const response = await axios.get<HatenaStarReponse>(apiURL, { timeout: 10 * 1000 });
  const json = response.data;
  return json.entries.map(({ uri, stars, colored_stars: coloredStars }) => ({
    url: uri,
    count: (stars && stars.length + sum(coloredStars && coloredStars.map(c => c.stars.length))) || 0,
    type: CountType.HatenaStar,
  }));
}
