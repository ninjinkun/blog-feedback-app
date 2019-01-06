import axios from 'axios';
import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';
import * as functions from 'firebase-functions';
import { chunk, flatten } from 'lodash';

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

export async function fetchFacebookCounts(urls: string[], maxFetchCount = 40, chunkNum = 4): Promise<CountResponse[]> {
  const slicedURLs = urls.slice(0, maxFetchCount - 1);
  const chunkedURLs = chunk(slicedURLs, chunkNum);
  const counts = await Promise.all(chunkedURLs.map(chunkedURL => fetchFacebookCountChunk(chunkedURL)));
  return flatten(counts);
}

async function fetchFacebookCountChunk(urls: string[], delayMsec: number = 800) {
  const counts = await Promise.all(urls.map(url => fetchFacebookCount(url)));
  sleep(delayMsec);
  return counts;
}

export async function fetchFacebookCount(url: string): Promise<CountResponse> {
  const accessToken = functions.config().facebook.access_token;
  const response = await axios.get(`https://graph.facebook.com/v3.2/?id=${encodeURIComponent(url)}&fields=engagement&access_token=${accessToken}`);
  const json = response.data;
  if (json.hasOwnProperty('engagement')) {
    return { url: json.id, count: json.engagement.share_count, type: CountType.Facebook };
  } else {
    throw new Error('Facebook count fetch failed: ' + url);
  }
}
