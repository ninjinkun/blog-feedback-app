import { CountResponse } from '../../../models/responses';

export const FETCH_POCKET_COUNT_REQUEST = 'feed/pocket/FETCH_COUNT_REQUEST';
export function feedFetchPocketCountRequest(blogURL: string) {
  return {
    type: FETCH_POCKET_COUNT_REQUEST as typeof FETCH_POCKET_COUNT_REQUEST,
    blogURL,
  };
}

export const FETCH_POCKET_COUNT_RESPONSE = 'feed/pocket/FETCH_COUNT_RESPONSE';
export function feedFetchPokcetCountResponse(blogURL: string, counts: CountResponse[]) {
  return {
    type: FETCH_POCKET_COUNT_RESPONSE as typeof FETCH_POCKET_COUNT_RESPONSE,
    blogURL,
    counts,
  };
}

export const FETCH_POCKET_COUNT_ERROR = 'feed/pocket/FETCH_COUNT_ERROR';
export function feedFetchPocketCountError(blogURL: string, error: Error) {
  return {
    type: FETCH_POCKET_COUNT_ERROR as typeof FETCH_POCKET_COUNT_ERROR,
    blogURL,
    error,
  };
}

export type FeedFetchPocketCountActions =
  | ReturnType<typeof feedFetchPocketCountRequest>
  | ReturnType<typeof feedFetchPokcetCountResponse>
  | ReturnType<typeof feedFetchPocketCountError>;
