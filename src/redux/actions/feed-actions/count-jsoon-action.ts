import { CountResponse } from '../../../models/responses';

export const FETCH_COUNT_JSOON_COUNT_REQUEST = 'feed/count.jsoon/FETCH_COUNT_REQUEST';
export function feedFetchCountJsoonCountRequest(blogURL: string) {
  return {
    type: FETCH_COUNT_JSOON_COUNT_REQUEST as typeof FETCH_COUNT_JSOON_COUNT_REQUEST,
    blogURL,
  };
}
export const FETCH_COUNT_JSOON_COUNT_RESPONSE = 'feed/count.jsoon/FETCH_COUNT_RESPONSE';
export function feedFetchCountJsoonCountResponse(blogURL: string, counts: CountResponse[]) {
  return {
    type: FETCH_COUNT_JSOON_COUNT_RESPONSE as typeof FETCH_COUNT_JSOON_COUNT_RESPONSE,
    blogURL,
    counts,
  };
}

export const FETCH_COUNT_JSOON_COUNT_ERROR = 'feed/count.jsoon/FETCH_COUNT_ERROR';
export function feedFetchCountJsoonCountError(blogURL: string, error: Error) {
  return {
    type: FETCH_COUNT_JSOON_COUNT_ERROR as typeof FETCH_COUNT_JSOON_COUNT_ERROR,
    blogURL,
    error,
  };
}

export type FeedFetchCountJsoonCountActions =
  | ReturnType<typeof feedFetchCountJsoonCountRequest>
  | ReturnType<typeof feedFetchCountJsoonCountResponse>
  | ReturnType<typeof feedFetchCountJsoonCountError>;
