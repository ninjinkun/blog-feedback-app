import axios, { AxiosResponse } from 'axios';
import * as iconv from 'iconv-lite';
const charset = require('charset');

export async function fetch(url: string): Promise<string> {
  const res: AxiosResponse<Buffer> = await axios.get(url, {      
     responseType: 'arraybuffer',
  });
  const encoding: string = charset(res.headers);
  return encoding ? iconv.decode(res.data, encoding) : res.data.toString('utf8');
}