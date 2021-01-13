import firebase from 'firebase/app';

import { FeedType } from './consts/feed-type';

export type BlogEntity = {
  title: string;
  url: string;
  feedURL: string;
  feedType: FeedType;
  services?: Services;
  sendReport: boolean;
};

export type Services = {
  twitter: boolean;
  countjsoon: boolean;
  facebook: boolean;
  hatenabookmark: boolean;
  hatenastar: boolean;
  pocket?: boolean;
};

export type ItemEntity = {
  title: string;
  url: string;
  published: firebase.firestore.Timestamp;
  counts: { [key: string]: CountEntity }; // key is CountType
  prevCounts: { [key: string]: CountEntity }; // 10 minutes before
  yesterdayCounts?: { [key: string]: CountEntity };
};

export type CountEntity = {
  count: number;
  timestamp: firebase.firestore.Timestamp;
};
