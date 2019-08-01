import { ItemEntity } from '../../../models/entities';
import { CountResponse, ItemResponse } from '../../../models/responses';

export const FIREBASE_SAVE_REQUEST = 'feed/FIREBASE_SAVE_REQUEST' as const;

export function feedSaveFeedRequest(
  blogURL: string,
  firebaseItems: ItemEntity[],
  fetchedItems: ItemResponse[],
  counts: CountResponse[]
) {
  return {
    type: FIREBASE_SAVE_REQUEST,
    blogURL,
    firebaseItems,
    fetchedItems,
    counts,
  };
}

export const FIREBASE_SAVE_RESPONSE = 'FeedSaveFeedFirebaseResponseAction' as const;

export function feedSaveFeedFirebaseResponse(blogURL: string) {
  return {
    type: FIREBASE_SAVE_RESPONSE,
    blogURL,
  };
}

export const FIREBASE_SAVE_ERROR = 'FeedFirebaseSaveErrorAction' as const;

export function feedFirebaseSaveError(blogURL: string, error: Error) {
  return {
    type: FIREBASE_SAVE_ERROR,
    blogURL,
    error,
  };
}

export type FeedFirebaseSaveActions =
  | ReturnType<typeof feedSaveFeedRequest>
  | ReturnType<typeof feedSaveFeedFirebaseResponse>
  | ReturnType<typeof feedFirebaseSaveError>;
