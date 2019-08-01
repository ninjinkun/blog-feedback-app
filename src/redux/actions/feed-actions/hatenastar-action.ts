import { CountResponse } from '../../../models/responses';

export const FETCH_HATENA_STAR_COUNT_REQUEST = 'feed/hatenastar/FETCH_COUNT_REQUEST' as const;
export function feedFetchHatenaStarCountsRequest(blogURL: string) {
  return {
    type: FETCH_HATENA_STAR_COUNT_REQUEST,
    blogURL,
  };
}

export const FETCH_HATENA_STAR_COUNT_RESPONSE = 'feed/hatenastar/FETCH_COUNT_RESPONSE' as const;
export function feedFetchHatenaStarCountsResponse(blogURL: string, counts: CountResponse[]) {
  return {
    type: FETCH_HATENA_STAR_COUNT_RESPONSE,
    blogURL,
    counts,
  };
}

export const FETCH_HATENA_STAR_COUNT_ERROR = 'feed/hatenastar/FETCH_COUNT_ERROR' as const;
export function feedFetchHatenaStarCountError(blogURL: string, error: Error) {
  return {
    type: FETCH_HATENA_STAR_COUNT_ERROR,
    blogURL,
    error,
  };
}

export type FeedFetchHatenaStarActions =
  | ReturnType<typeof feedFetchHatenaStarCountsRequest>
  | ReturnType<typeof feedFetchHatenaStarCountsResponse>
  | ReturnType<typeof feedFetchHatenaStarCountError>;
