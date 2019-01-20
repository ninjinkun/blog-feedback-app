import axios, { AxiosResponse } from 'axios';
import * as iconv from 'iconv-lite';
const charset = require('charset');

export async function fetchText(url: string): Promise<string> {
  return fetch(url, 'text/html,application/xhtml+xml,application/xml,application/rss+xml,application/atom+xml');
}

export function fetchJSON(url: string): Promise<string> {
  return fetch(url, 'application/json,text/json')
}

async function fetch(url: string, acceptHeader: string): Promise<string> {
  const res: AxiosResponse<Buffer> = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': 'BlogFeedback/0.1',
      'Accept': acceptHeader,
     },
     maxRedirects: 5,
    });
 const encoding: string = charset(res.headers);
 return encoding ? iconv.decode(res.data, encoding) : res.data.toString('utf8');
}