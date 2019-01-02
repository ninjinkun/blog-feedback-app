import { CountType } from '../../consts/count-type';
import { CountResponse } from '../../responses';
import { crossOriginFetch } from '../functions';

export async function fetchPocketCount(url: string): Promise<CountResponse> {
  const apiURL = `https://widgets.getpocket.com/v1/button?label=pocket&count=vertical&v=1&url=${encodeURIComponent(
    url
  )}&src=${encodeURIComponent(url)}`;
  const response = await crossOriginFetch(apiURL);
  const htmlText = response.data.body;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const result = doc.evaluate(`//em[@id="cnt"]/text()`, doc, null, XPathResult.STRING_TYPE, null);
  const countString = result.stringValue;
  const count = countString ? parseInt(countString.replace(/,/, ''), 10) : 0;
  return { url, count, type: CountType.Pocket };
}
