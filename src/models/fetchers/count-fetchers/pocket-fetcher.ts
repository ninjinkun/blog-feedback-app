import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';
import { crossOriginFetch } from '../functions';

export async function fetchPocketCount(url: string): Promise<CountResponse> {
  const apiURL = `https://widgets.getpocket.com/api/saves?url=${encodeURIComponent(url)}`;
  const response = await crossOriginFetch(apiURL);
  const json = JSON.parse(response.data.body);
  const count = json.saves;
  return { url, count, type: CountType.Pocket };
}
