import { ItemEntity, Services } from '../../models/entities';
import { CountResponse, ItemResponse } from '../../models/responses';

export type FeedState = {
  firebaseEntities?: ItemEntity[];
  fethcedEntities?: ItemResponse[];
  fetchedCountJsoonCounts?: CountResponse[];
  fetchedHatenaBookmarkCounts?: CountResponse[];
  fetchedHatenaStarCounts?: CountResponse[];
  fetchedFacebookCounts?: CountResponse[];
  fetchedPocketCounts?: CountResponse[];
  title?: string;
  services?: Services;
  sendReport?: boolean;
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
