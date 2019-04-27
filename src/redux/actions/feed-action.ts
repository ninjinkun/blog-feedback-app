import firebase from 'firebase/app';
import 'firebase/auth';

import { ItemEntity } from '../../models/entities';
import { FeedFetchCountJsoonCountActions } from './feed-actions/count-jsoon-action';
import { FeedFetchFacebookCountActions } from './feed-actions/facebook-action';
import { FeedFirebaseActions } from './feed-actions/feed-firebase-action';
import { FeedFirebaseSaveActions } from './feed-actions/feed-firebase-save-action';
import { FeedFetchHatenaBookmarkCountActions } from './feed-actions/hatenabookmark-action';
import { FeedFetchHatenaStarActions } from './feed-actions/hatenastar-action';
import { FeedFetchPocketCountActions } from './feed-actions/pocket-action';
import { FeedFetchRSSActions } from './feed-actions/rss';

export const BLOG_URL_CHANGE = 'feed/BLOG_URL_CHANGE';
export function feedBlogURLChange(blogURL: string) {
  return {
    type: BLOG_URL_CHANGE as typeof BLOG_URL_CHANGE,
    blogURL,
  };
}

export const BLOG_URL_CLEAR = 'feed/BLOG_URL_CLEAR';
export function feedBlogURLClear() {
  return {
    type: BLOG_URL_CLEAR as typeof BLOG_URL_CLEAR,
  };
}

export const FETCH_AND_SAVE_START = 'feed/FETCH_AND_SAVE_START';
export function fetchFeed(auth: firebase.auth.Auth, blogURL: string) {
  return {
    type: FETCH_AND_SAVE_START as typeof FETCH_AND_SAVE_START,
    auth,
    blogURL,
  };
}

export type FeedFetchFeedAction = ReturnType<typeof fetchFeed>;

export const FEED_FETCH_AND_SAVE_ERROR = 'feed/FEED_FETCH_AND_SAVE_ERROR';
export function feedFetchAndSaveError(blogURL: string, error: Error) {
  return {
    type: FEED_FETCH_AND_SAVE_ERROR as typeof FEED_FETCH_AND_SAVE_ERROR,
    blogURL,
    error,
  };
}

export type ItemEntitiesFunction = () => ItemEntity[];

type FeedFetchCountsActions =
  | FeedFetchCountJsoonCountActions
  | FeedFetchHatenaBookmarkCountActions
  | FeedFetchHatenaStarActions
  | FeedFetchFacebookCountActions
  | FeedFetchPocketCountActions;

type FeedFetchAndSaveActions =
  | FeedFirebaseActions
  | FeedFetchRSSActions
  | FeedFetchCountsActions
  | FeedFirebaseSaveActions
  | ReturnType<typeof feedBlogURLClear>
  | ReturnType<typeof feedFetchAndSaveError>;

export type FeedActions = ReturnType<typeof feedBlogURLChange> | ReturnType<typeof fetchFeed> | FeedFetchAndSaveActions;
