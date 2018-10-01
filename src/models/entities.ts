import { CountType } from '../consts/count-type';

export type BlogEntity = {
  title: string,
  url: string,
  feedUrl: string
};

export type ItemEntity = {
  title: string,
  url: string,
  published: Date
  counts: CountsMap 
  prevCounts: CountsMap // 10 minutes before
};

export type CountsMap = { [key: string]: CountEntity }; // key is CountType

export type CountEntity = {
  count: number,
  created: Date,
};