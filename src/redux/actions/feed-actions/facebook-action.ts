import { CountResponse } from '../../../models/responses';

export const FETCH_FACEBOOK_COUNT_REQUEST = 'feed/facebook/FETCH_COUNT_REQUEST';
export function feedFetchFacebookCountRequest(blogURL: string) {
  return {
    type: FETCH_FACEBOOK_COUNT_REQUEST as typeof FETCH_FACEBOOK_COUNT_REQUEST,
    blogURL,
  };
}
export const FETCH_FACEBOOK_COUNT_RESPONSE = 'feed/facebook/FETCH_COUNT_RESPONSE';
export function feedFetchFacebookCountResponse(blogURL: string, counts: CountResponse[]) {
  return {
    type: FETCH_FACEBOOK_COUNT_RESPONSE as typeof FETCH_FACEBOOK_COUNT_RESPONSE,
    blogURL,
    counts,
  };
}

export const FETCH_FACEBOOK_COUNT_ERROR = 'feed/facebook/FETCH_COUNT_ERROR';
export function feedFetchFacebookCountError(blogURL: string, error: Error) {
  return {
    type: FETCH_FACEBOOK_COUNT_ERROR as typeof FETCH_FACEBOOK_COUNT_ERROR,
    blogURL,
    error,
  };
}

export type FeedFetchFacebookCountActions =
  | ReturnType<typeof feedFetchFacebookCountRequest>
  | ReturnType<typeof feedFetchFacebookCountResponse>
  | ReturnType<typeof feedFetchFacebookCountError>;
