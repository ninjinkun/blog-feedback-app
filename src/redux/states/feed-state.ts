import { ItemEntity, CountEntity } from '../../models/entities';
import { ItemResponse, CountResponse } from '../../models/responses';

export type FeedState = {
  firebaseEntities?: ItemEntity[];
  firebaseCounts?: CountEntity[];
  fethcedEntities?: ItemResponse[];
  fetchedCounts?: CountResponse[];
  title?: string;
  loading: boolean;
  error?: Error;
};

export const initialState = {
  loading: false,
};