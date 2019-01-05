import axios from 'axios';
import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';
import * as functions from 'firebase-functions';

export function fetchFacebookCounts(urls: string[]): Array<Promise<CountResponse>> {
  return urls.map(url => fetchFacebookCount(url));
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
