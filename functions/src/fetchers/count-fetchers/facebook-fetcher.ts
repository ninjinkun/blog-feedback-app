import axios from 'axios';
import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';
import * as functions from 'firebase-functions';
import * as qs from 'qs';

type FacebookBatchResponse = {
  body: string;
  code: number;
  headers: {
    name: string;
    value: string;
  };
};

type FacebookResponse = {
  id: string;
  share: {
    share_count: number;
    comment_count: number;
  };
};

export async function fetchFacebookCounts(urls: string[]): Promise<CountResponse[]> {
  const batch = urls.map(url => ({
    method: 'GET',
    relative_url: `?id=${encodeURIComponent(url)}`,
  }));
  const accessToken = functions.config().facebook.access_token;
  const response = await axios.post(
    'https://graph.facebook.com/',
    qs.stringify({
      access_token: accessToken,
      batch: JSON.stringify(batch),
    })
  );
  return response.data
    .map((json: FacebookBatchResponse) => JSON.parse(json.body))
    .filter((json: FacebookResponse) => json.hasOwnProperty('share'))
    .map((json: FacebookResponse) => ({
      url: json.id,
      count: json.share.share_count,
      type: CountType.Facebook,
    }));
}
