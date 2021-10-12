import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { CountType } from '../models/consts/count-type';
import { ItemEntity } from '../models/entities';
import { CountResponse, ItemResponse } from '../models/responses';
import { createSaveEntities } from '../models/save-count-response';

describe('create save entities', () => {
  it('equeal', () => {
    expect(createSaveEntities(firebaseEntities, feedItemResponse, countsReponse)).toEqual(result);
  });
});

const firebaseEntities: ItemEntity[] = [
  {
    title: 'Ikyu Frontend Meetupを開催しました',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/14/154352',
    published: new firebase.firestore.Timestamp(1544769832, 0),
    counts: {
      facebook: { count: 4, timestamp: new firebase.firestore.Timestamp(1544787808, 337000000) },
      hatenabookmark: { count: 6, timestamp: new firebase.firestore.Timestamp(1544787808, 337000000) },
    },
    prevCounts: {
      facebook: { count: 3, timestamp: new firebase.firestore.Timestamp(1544787295, 410000000) },
      hatenabookmark: { count: 4, timestamp: new firebase.firestore.Timestamp(1544775366, 395000000) },
    },
  },
];

const feedItemResponse: ItemResponse[] = [
  {
    title: 'Ikyu Frontend Meetupを開催しました',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/14/154352',
    published: new Date('2018-12-14T06:43:52.000Z'),
  },
];

const countsReponse: CountResponse[] = [
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/14/154352', count: 4, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/14/154352', count: 18, type: 'hatenabookmark' as CountType },
];

const result = [
  {
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/14/154352',
    title: 'Ikyu Frontend Meetupを開催しました',
    published: new Date('2018-12-14T06:43:52.000Z'),
    itemCounts: {
      facebook: { count: 4, timestamp: new firebase.firestore.Timestamp(1544787808, 337000000) },
      hatenabookmark: { count: 18, timestamp: expect.anything() },
    },
    prevCounts: {
      facebook: { count: 4, timestamp: new firebase.firestore.Timestamp(1544787808, 337000000) },
      hatenabookmark: { count: 6, timestamp: new firebase.firestore.Timestamp(1544787808, 337000000) },
    },
  },
];
