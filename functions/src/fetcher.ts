import axios, { AxiosResponse } from 'axios';

export async function fetch(url: string): Promise<string> {
  const res: AxiosResponse<string> = await axios.get(url);
  return res.data;
}