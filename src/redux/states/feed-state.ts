import { ItemEntity, CountEntity } from '../../models/entities';
import { ItemResponse, CountResponse } from '../../models/responses';

export type FeedState = {
  firebaseEntities?: ItemEntity[];
  fethcedEntities?: ItemResponse[];
  fetchedCounts?: CountResponse[];
  title?: string;
  loading: boolean;
  error?: Error;
  feedURL?: string;
  crowlingRatio: number; // 0...100
  crowlingLabel?: string;
};

export const initialState = {
  loading: false,
  crowlingRatio: 0,
};