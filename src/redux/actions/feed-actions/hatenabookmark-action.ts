import { CountResponse } from '../../../models/responses';

export const FETCH_HATENA_BOOKMARK_COUNT_REQUEST = 'feed/hatenabookmark/FETCH_COUNT_REQUEST';
export function feedFetchHatenaBookmarkCountsRequest(blogURL: string) {
  return {
    type: FETCH_HATENA_BOOKMARK_COUNT_REQUEST as typeof FETCH_HATENA_BOOKMARK_COUNT_REQUEST,
    blogURL,
  };
}

export const FETCH_HATENA_BOOKMARK_COUNT_RESPONSE = 'feed/hatenabookmark/FETCH_COUNNT_RESPONSE';
export function feedFetchHatenaBookmarkCountsResponse(blogURL: string, counts: CountResponse[]) {
  return {
    type: FETCH_HATENA_BOOKMARK_COUNT_RESPONSE as typeof FETCH_HATENA_BOOKMARK_COUNT_RESPONSE,
    blogURL,
    counts,
  };
}

export const FETCH_HATENA_BOOKMARK_COUNNT_ERROR = 'feed/hatenabookmark/FETCH_COUNT_ERROR';
export function feedFetchHatenaBookmarkCountError(blogURL: string, error: Error) {
  return {
    type: FETCH_HATENA_BOOKMARK_COUNNT_ERROR as typeof FETCH_HATENA_BOOKMARK_COUNNT_ERROR,
    blogURL,
    error,
  };
}

export type FeedFetchHatenaBookmarkCountActions =
  | ReturnType<typeof feedFetchHatenaBookmarkCountsRequest>
  | ReturnType<typeof feedFetchHatenaBookmarkCountsResponse>;
