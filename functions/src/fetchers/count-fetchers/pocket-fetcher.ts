import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { chunk, flatten } from 'lodash';
import { sleep } from '../../sleep';

export async function fetchPocketCounts(
  urls: string[],
  maxFetchCount: number = 40,
  chunkNum: number = 10
): Promise<CountResponse[]> {
  const slicedURLs = urls.slice(0, maxFetchCount - 1);
  const chunkedURLs = chunk(slicedURLs, chunkNum);
  const counts = await Promise.all(chunkedURLs.map(chunkedURL => fetchPocketCountChunk(chunkedURL)));
  return flatten(counts);
}

async function fetchPocketCountChunk(urls: string[], delayMsec: number = 400) {
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
