import { ItemEntity, Services } from '../../models/entities';
import { CountResponse, ItemResponse } from '../../models/responses';

export type FeedState = {
  firebaseEntities?: ItemEntity[];
  fethcedEntities?: ItemResponse[];
  fetchedHatenaBookmarkCounts?: CountResponse[];
  fetchedHatenaStarCounts?: CountResponse[];
  fetchedFacebookCounts?: CountResponse[];
  title?: string;
  services?: Services;
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
