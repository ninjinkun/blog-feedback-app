import { CountType } from '../consts/count-type';
import { FeedType } from '../consts/feed-type';

export type BlogResponse = {
  title: string;
  url: string;
  feedURL: string;
  feedType: FeedType;
};

export type ItemResponse = {
  title: string;
  url: string;
  published: Date;
};

export type CountResponse = {
  type: CountType;
  url: string;
  count: number;
};
