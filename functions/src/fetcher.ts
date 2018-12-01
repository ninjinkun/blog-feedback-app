import axios, { AxiosResponse } from 'axios';
import * as iconv from 'iconv-lite';
import * as jschardet from 'jschardet';
const charset = require('charset');

export async function fetch(url: string): Promise<string> {
  const res: AxiosResponse<Buffer> = await axios.get(url, {      
     responseType: 'arraybuffer',
  });
  let encoding: string = charset(res.headers);
  if (!encoding) {
    const text = res.data.toString('utf8');
    encoding = jschardet.detect(text).encoding.toLowerCase();;
  }
  return iconv.decode(res.data, encoding);
}