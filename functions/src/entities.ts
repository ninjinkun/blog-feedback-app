import { firestore } from 'firebase-admin';
import { FeedType } from './consts/feed-type';

export interface BlogEntity {
  title: string;
  url: string;
  feedURL: string;
  feedType: FeedType;
  services?: Services;
  sendReport: boolean;
}

export interface Services {
  twitter: boolean;
  countjsoon: boolean;
  facebook: boolean;
  hatenabookmark: boolean;
  hatenastar: boolean;
  pocket?: boolean;
}

export interface ItemEntity {
  title: string;
  url: string;
  published: firestore.Timestamp;
  counts: { [key: string]: CountEntity }; // key is CountType
  prevCounts: { [key: string]: CountEntity }; // 10 minutes before
  yesterdayCounts?: { [key: string]: CountEntity };
}

export interface CountEntity {
  count: number;
  timestamp: firestore.Timestamp;
}
