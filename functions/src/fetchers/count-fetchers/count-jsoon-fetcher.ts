import axios from 'axios';
import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';
import { chunk, flatten } from 'lodash';

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

export async function fetchCountJsoonCounts(urls: string[], maxFetchCount: number = 20, chunkNum = 10): Promise<CountResponse[]> {
  const slicedURLs = urls.slice(0, maxFetchCount - 1);
  const chunkedURLs = chunk(slicedURLs, chunkNum);
  const counts = await Promise.all(chunkedURLs.map(chunkedURL => fetchCountJsoonCountChunk(chunkedURL)));
  return flatten(counts);
}

async function fetchCountJsoonCountChunk(urls: string[], delayMsec: number = 200) {
  const counts = await Promise.all(urls.map(url => fetchCountJsoonCount(url)));
  sleep(delayMsec);
  return counts;
}

export async function fetchCountJsoonCount(url: string): Promise<CountResponse> {
  const response = await axios.get(`https://jsoon.digitiminimi.com/twitter/count.json?url=${encodeURIComponent(url)}`);
  const json = response.data;
  const { count } = json;
  if (count !== undefined) {
    return { url, count, type: CountType.CountJsoon };
  } else {
    throw new Error('maybe you must register count.jsoon: ' + url);
  }
}
