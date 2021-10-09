import axios, { AxiosResponse } from 'axios';
import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';
import * as functions from 'firebase-functions';
import * as qs from 'qs';

interface FacebookBatchResponse {
  body: string;
  code: number;
  headers: {
    name: string;
    value: string;
  };
}

interface FacebookResponse {
  id: string;
  og_object: {
    engagement: {
      count: number;
    };
  };
}

export async function fetchFacebookCounts(urls: string[], maxFetchCount=30): Promise<CountResponse[]> {
  const batch = urls.slice(0, maxFetchCount - 1).map(url => ({
    method: 'GET',
    'relative_url': `?id=${encodeURIComponent(url)}&fields=og_object{engagement}`,
  }));
  const accessToken = functions.config().facebook.access_token;
  const response = await axios.post<string, AxiosResponse<FacebookBatchResponse[]>>(
    'https://graph.facebook.com/',
    qs.stringify({
      'access_token': accessToken,
      batch: JSON.stringify(batch),
    }),
    { timeout: 10 * 1000 }
  );
  return response.data
    .map((json: FacebookBatchResponse) => JSON.parse(json.body))
    .filter((json: FacebookResponse) => json.hasOwnProperty('og_object'))
    .map(({ id, og_object: ogObject }: FacebookResponse) => ({
      url: id,
      count: ogObject.engagement.count,
      type: CountType.Facebook,
    }));
}
