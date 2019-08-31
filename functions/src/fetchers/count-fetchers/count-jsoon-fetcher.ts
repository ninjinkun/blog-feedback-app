import axios from 'axios';
import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';
import { chunk, flatten } from 'lodash';
import { sleep } from '../../sleep';

export async function fetchCountJsoonCounts(
  urls: string[],
  maxFetchCount = 20,
  chunkNum = 10
): Promise<CountResponse[]> {
  const slicedURLs = urls.slice(0, maxFetchCount - 1);
  const chunkedURLs = chunk(slicedURLs, chunkNum);
  const counts = await Promise.all(chunkedURLs.map(chunkedURL => fetchCountJsoonCountChunk(chunkedURL)));
  return flatten(counts);
}

async function fetchCountJsoonCountChunk(urls: string[], delayMsec = 200) {
  await sleep(delayMsec);
  const counts = await Promise.all(urls.map(url => fetchCountJsoonCount(url)));
  return counts.filter(c => c !== undefined);
}

export async function fetchCountJsoonCount(url: string): Promise<CountResponse | undefined> {
  try {
    const response = await axios.get(
      `https://jsoon.digitiminimi.com/twitter/count.json?url=${encodeURIComponent(url)}`,
      { timeout: 10 * 1000 }
    );
    const json = response.data;
    const { count } = json;
    if (count !== undefined) {
      return { url, count, type: CountType.CountJsoon };
    } else {
      return undefined;
      throw new Error('maybe you must register count.jsoon: ' + url);
    }
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}
