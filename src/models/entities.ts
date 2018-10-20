import { CountType } from '../consts/count-type';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { ItemResponse } from './responses';

export type BlogEntity = {
  title: string,
  url: string,
  feedURL: string
};

export type ItemEntity = {
  title: string,
  url: string,
  published: firebase.firestore.Timestamp,
  counts: { [key: string]: CountEntity }, // key is CountType
  prevCounts: { [key: string]: CountEntity }, // 10 minutes before
};

export type CountEntities = {
  facebook?: CountEntity[],
  hatenabookmark?: CountEntity[]
};

export type CountEntity = {
  count: number,
  timestamp: firebase.firestore.Timestamp,
};
