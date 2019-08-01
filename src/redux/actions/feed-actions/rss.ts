import { ItemResponse } from '../../../models/responses';

export const FETCH_RSS_REQUEST = 'feed/rss/FETCH_REQUEST' as const;
export function feedFetchRSSRequest(blogURL: string) {
  return {
    type: FETCH_RSS_REQUEST,
    blogURL,
  };
}

export const FETCH_RSS_RESPONSE = 'feed/rss/FETCH_RESPONSE' as const;
export function feedFetchRSSResponse(blogURL: string, items: ItemResponse[]) {
  return {
    type: FETCH_RSS_RESPONSE,
    blogURL,
    items,
  };
}

export const FETCH_RSS_ERROR = 'feed/rss/FETCH_ERROR' as const;
export function feedFetchRSSError(blogURL: string, error: Error) {
  return {
    type: FETCH_RSS_ERROR,
    blogURL,
    error,
  };
}

export type FeedFetchRSSActions =
  | ReturnType<typeof feedFetchRSSRequest>
  | ReturnType<typeof feedFetchRSSResponse>
  | ReturnType<typeof feedFetchRSSError>;
