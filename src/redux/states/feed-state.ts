import { ItemEntity, CountEntity } from '../../models/entities';
import { ItemResponse, CountResponse } from '../../models/responses';

export type FeedState = {
  firebaseEntities?: ItemEntity[];
  fethcedEntities?: ItemResponse[];
  fetchedHatenaBookmarkCounts?: CountResponse[];
  fetchedFacebookCounts?: CountResponse[];
  title?: string;
  loading: boolean;
  error?: Error;
  feedURL?: string;
  loadingRatio: number; // 0...100
  loadingLabel?: string;
};

export const initialState = {
  loading: false,
  loadingRatio: 0,
};