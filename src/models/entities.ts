import firebase from 'firebase/app';
import 'firebase/firestore';
import { FeedType } from '../consts/feed-type';

export type BlogEntity = {
  title: string;
  url: string;
  feedURL: string;
  feedType: FeedType;
  services?: Services;
};

export type Services = {
  twitter: boolean;
  facebook: boolean;
  hatenabookmark: boolean;
  hatenastar: boolean;
};

export type ItemEntity = {
  title: string;
  url: string;
  published: firebase.firestore.Timestamp;
  counts: { [key: string]: CountEntity }; // key is CountType
  prevCounts: { [key: string]: CountEntity }; // 10 minutes before
};

export type CountEntities = {
  facebook?: CountEntity;
  hatenabookmark?: CountEntity;
  hatenastar?: CountEntity;
};

export type CountEntity = {
  count: number;
  timestamp: firebase.firestore.Timestamp;
};
