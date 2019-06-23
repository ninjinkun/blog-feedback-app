import { CountType } from './consts/count-type';
import { FeedType } from './consts/feed-type';

export interface BlogResponse {
  title: string;
  url: string;
  feedURL: string;
  feedType: FeedType;
  isHatenaBlog: boolean;
}

export interface FeedResponse {
  title: string;
  url: string;
  items: ItemResponse[];
  feedType: FeedType;
}

export interface ItemResponse {
  title: string;
  url: string;
  published: Date;
}

export interface CountResponse {
  type: CountType;
  url: string;
  count: number;
}
