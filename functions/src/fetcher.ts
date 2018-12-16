import axios, { AxiosResponse } from 'axios';
import * as iconv from 'iconv-lite';
const charset = require('charset');

export async function fetch(url: string): Promise<string> {
  const res: AxiosResponse<Buffer> = await axios.get(url, {      
     responseType: 'arraybuffer',
     headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36' },
  });
  const encoding: string = charset(res.headers);
  return encoding ? iconv.decode(res.data, encoding) : res.data.toString('utf8');
}