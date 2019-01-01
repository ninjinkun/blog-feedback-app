import { CountType } from '../../../consts/count-type';
import { CountResponse } from '../../responses';

export function fetchFacebookCounts(urls: string[]): Array<Promise<CountResponse>> {
  return urls.map(url => fetchFacebookCount(url));
}

export async function fetchFacebookCount(url: string): Promise<CountResponse> {
  const response = await fetch(`https://graph.facebook.com/?id=${encodeURIComponent(url)}`);
  const json = await response.json();
  if (json.hasOwnProperty('share')) {
    return { url: json.id, count: json.share.share_count, type: CountType.Facebook };
  } else {
    throw new Error('Facebook count fetch failed: ' + url);
  }
}
