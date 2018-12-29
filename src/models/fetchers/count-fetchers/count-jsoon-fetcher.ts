import fetchJsonp from 'fetch-jsonp';
import { CountType } from '../../../consts/count-type';
import { CountResponse } from '../../responses';

export async function fetchCountJsoonCount(url: string): Promise<CountResponse> {
  const response = await fetchJsonp(`https://jsoon.digitiminimi.com/twitter/count.json?url=${encodeURIComponent(url)}`);
  const json = await response.json();
  const { count } = json;
  if (count !== undefined) {
    return { url, count, type: CountType.CountJsoon };
  } else {
    throw new Error('maybe you must register count.jsoon: ' + url);
  }
}
