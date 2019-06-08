import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';

export function fetchFacebookCounts(urls: string[]): Array<Promise<CountResponse>> {
  return urls.map(url => fetchFacebookCount(url));
}

export async function fetchFacebookCount(url: string): Promise<CountResponse> {
  const response = await fetch(
    `https://graph.facebook.com/?id=${encodeURIComponent(url)}&fields=og_object{engagement}`
  );
  const json = await response.json();
  if (json.hasOwnProperty('og_object') && json.og_object.hasOwnProperty('engagement')) {
    return { url: json.id, count: json.og_object.engagement.count, type: CountType.Facebook };
  } else {
    return { url: json.id, count: 0, type: CountType.Facebook };
  }
}
