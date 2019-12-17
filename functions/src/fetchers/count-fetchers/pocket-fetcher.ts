import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';
import axios from 'axios';
import { chunk, flatten } from 'lodash';
import { sleep } from '../../sleep';

export async function fetchPocketCounts(
  urls: string[],
  maxFetchCount = 40,
  chunkNum = 10
): Promise<CountResponse[]> {
  const slicedURLs = urls.slice(0, maxFetchCount - 1);
  const chunkedURLs = chunk(slicedURLs, chunkNum);
  const counts = await Promise.all(chunkedURLs.map(chunkedURL => fetchPocketCountChunk(chunkedURL)));
  return flatten(counts);
}

async function fetchPocketCountChunk(urls: string[], delayMsec = 400): Promise<CountResponse[]> {
  await sleep(delayMsec);
  const counts = await Promise.all(urls.map(url => fetchPocketCount(url)));
  return counts.filter(c => c !== undefined);
}

export async function fetchPocketCount(url: string): Promise<CountResponse | undefined> {
  try {
    const apiURL = `https://widgets.getpocket.com/api/saves?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiURL, { timeout: 10 * 1000 });
    const json = response.data;
    const count = json.saves;
    return { url, count, type: CountType.Pocket };
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}
