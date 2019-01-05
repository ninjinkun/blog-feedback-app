import axios from 'axios';
import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';

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
