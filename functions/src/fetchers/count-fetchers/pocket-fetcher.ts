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
    const apiURL = `https://widgets.getpocket.com/v1/button?label=pocket&count=vertical&v=1&url=${encodeURIComponent(
      url
    )}&src=${encodeURIComponent(url)}`;
    const response = await axios.get(apiURL, { timeout: 2 * 1000 });
    const htmlText = response.data;
    const $ = cheerio.load(htmlText);
    const countString = $('em#cnt').text();
    const count = countString ? parseInt(countString.replace(/,/, ''), 10) : 0;
    return { url, count, type: CountType.Pocket };
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}
