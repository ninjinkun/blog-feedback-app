import firebase from 'firebase/app';
import 'firebase/auth';

import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { BlogEntity, ItemEntity } from '../../models/entities';
import { findBlog } from '../../models/repositories/blog-repository';
import { CountResponse, ItemResponse } from '../../models/responses';
import { AppState } from '../states/app-state';
import { currenUserOronAuthStateChanged } from './user-action';

export interface FeedBlogURLChangeAction extends Action {
  type: 'FeedBlogURLChangeAction';
  blogURL: string;
}

export function feedBlogURLChange(blogURL: string): FeedBlogURLChangeAction {
  return {
    type: 'FeedBlogURLChangeAction',
    blogURL,
  };
}

export interface FeedBlogURLClearAction extends Action {
  type: 'FeedBlogURLClearAction';
}

export function feedBlogURLClear(): FeedBlogURLClearAction {
  return {
    type: 'FeedBlogURLClearAction',
  };
}

export interface FeedFetchFeedAction extends Action {
  type: 'FeedFetchFeedAction';
  blogURL: string;
  auth: firebase.auth.Auth;
}

export function fetchFeed(blogURL: string, auth: firebase.auth.Auth): FeedFetchFeedAction {
  return {
    type: 'FeedFetchFeedAction',
    blogURL,
    auth,
  };
}

export interface FeedUserResponseAction extends Action {
  type: 'FeedUserResponseAction';
  blogURL: string;
  user: firebase.User;
}

export function userResponse(blogURL: string, user: firebase.User): FeedUserResponseAction {
  return {
    type: 'FeedUserResponseAction',
    blogURL,
    user,
  };
}

export interface FeedFirebaseFeedItemsResponseAction extends Action {
  type: 'FeedFirebaseFeedItemsResponseAction';
  blogURL: string;
  items: ItemEntity[];
}

export function feedFirebaseFeedItemsResponse(
  blogURL: string,
  items: ItemEntity[]
): FeedFirebaseFeedItemsResponseAction {
  return {
    type: 'FeedFirebaseFeedItemsResponseAction',
    blogURL,
    items,
  };
}

export interface FeedFirebaseBlogRequestAction extends Action {
  type: 'FeedFirebaseBlogRequestAction';
  blogURL: string;
}

export function feedFirebaseBlogRequest(blogURL: string): FeedFirebaseBlogRequestAction {
  return {
    type: 'FeedFirebaseBlogRequestAction',
    blogURL,
  };
}

export interface FeedFirebaseBlogResponseAction extends Action {
  type: 'FeedFirebaseBlogResponseAction';
  blogURL: string;
  blogEntity: BlogEntity;
  user: firebase.User;
}

export function feedFirebaseBlogResponse(
  blogURL: string,
  blogEntity: BlogEntity,
  user: firebase.User
): FeedFirebaseBlogResponseAction {
  return {
    type: 'FeedFirebaseBlogResponseAction',
    blogURL,
    blogEntity,
    user,
  };
}

export interface FeedFirebaseBlogErrorAction extends Action {
  type: 'FeedFirebaseBlogErrorAction';
  blogURL: string;
  error: Error;
}

export function feedFirebaseBlogError(blogURL: string, error: Error): FeedFirebaseBlogErrorAction {
  return {
    type: 'FeedFirebaseBlogErrorAction',
    blogURL,
    error,
  };
}

export type FeedFirebaseActions =
  | FeedFetchFeedAction
  | FeedFirebaseBlogRequestAction
  | FeedFirebaseFeedItemsResponseAction
  | FeedFirebaseBlogResponseAction
  | FeedFirebaseBlogErrorAction;

export interface FeedCrowlerRequestAction extends Action {
  type: 'FeedCrowlerRequestAction';
  blogURL: string;
}

export function feedCrowlerRequest(blogURL: string): FeedCrowlerRequestAction {
  return {
    type: 'FeedCrowlerRequestAction',
    blogURL,
  };
}

export interface FeedFirebaseUserResponseAction extends Action {
  type: 'FeedFirebaseUserResponseAction';
  blogURL: string;
  user: firebase.User;
}

export function feedFirebaseUserResponse(blogURL: string, user: firebase.User): FeedFirebaseUserResponseAction {
  return {
    type: 'FeedFirebaseUserResponseAction',
    blogURL,
    user,
  };
}

export interface FeedFetchRSSRequestAction extends Action {
  type: 'FeedFetchRSSRequestAction';
  blogURL: string;
}

export function feedFetchRSSRequest(blogURL: string): FeedFetchRSSRequestAction {
  return {
    type: 'FeedFetchRSSRequestAction',
    blogURL,
  };
}

export interface FeedFetchRSSResponseAction extends Action {
  type: 'FeedFetchRSSResponseAction';
  blogURL: string;
  items: ItemResponse[];
}

export function feedFetchRSSResponse(blogURL: string, items: ItemResponse[]): FeedFetchRSSResponseAction {
  return {
    type: 'FeedFetchRSSResponseAction',
    blogURL,
    items,
  };
}

export interface FeedFetchHatenaBookmarkCountsRequestAction extends Action {
  type: 'FeedFetchHatenaBookmarkCountsRequestAction';
  blogURL: string;
}

export function feedFetchHatenaBookmarkCountsRequest(blogURL: string): FeedFetchHatenaBookmarkCountsRequestAction {
  return {
    type: 'FeedFetchHatenaBookmarkCountsRequestAction',
    blogURL,
  };
}

export interface FeedFetchHatenaBookmarkCountsResponseAction extends Action {
  type: 'FeedFetchHatenaBookmarkCountsResponseAction';
  blogURL: string;
  counts: CountResponse[];
}

export function feedFetchHatenaBookmarkCountsResponse(
  blogURL: string,
  counts: CountResponse[]
): FeedFetchHatenaBookmarkCountsResponseAction {
  return {
    type: 'FeedFetchHatenaBookmarkCountsResponseAction',
    blogURL,
    counts,
  };
}

export interface FeedFetchFacebookCountRequestAction extends Action {
  type: 'FeedFetchFacebookCountRequestAction';
  blogURL: string;
}

export function feedFetchFacebookCountRequest(blogURL: string): FeedFetchFacebookCountRequestAction {
  return {
    type: 'FeedFetchFacebookCountRequestAction',
    blogURL,
  };
}

export interface FeedFetchFacebookCountResponseAction extends Action {
  type: 'FeedFetchFacebookCountResponseAction';
  blogURL: string;
  counts: CountResponse[];
}

export function feedFetchFacebookCountResponse(
  blogURL: string,
  counts: CountResponse[]
): FeedFetchFacebookCountResponseAction {
  return {
    type: 'FeedFetchFacebookCountResponseAction',
    blogURL,
    counts,
  };
}

export interface FeedSaveFeedFirebaseRequestAction extends Action {
  type: 'FeedSaveFeedFirebaseRequestAction';
  blogURL: string;
  firebaseItems: ItemEntity[];
  fetchedItems: ItemResponse[];
  counts: CountResponse[];
}

export function feedSaveFeedRequest(
  blogURL: string,
  firebaseItems: ItemEntity[],
  fetchedItems: ItemResponse[],
  counts: CountResponse[]
): FeedSaveFeedFirebaseRequestAction {
  return {
    type: 'FeedSaveFeedFirebaseRequestAction',
    blogURL,
    firebaseItems,
    fetchedItems,
    counts,
  };
}

export interface FeedSaveFeedFirebaseResponseAction extends Action {
  type: 'FeedSaveFeedFirebaseResponseAction';
  blogURL: string;
}

export function feedSaveFeedFirebaseResponse(blogURL: string): FeedSaveFeedFirebaseResponseAction {
  return {
    type: 'FeedSaveFeedFirebaseResponseAction',
    blogURL,
  };
}

export interface FeedCrowlerErrorAction extends Action {
  type: 'FeedCrowlerErrorAction';
  blogURL: string;
  error: Error;
}

export function feedCrowlerErrorResponse(blogURL: string, error: Error): FeedCrowlerErrorAction {
  return {
    type: 'FeedCrowlerErrorAction',
    blogURL,
    error,
  };
}

export type ItemEntitiesFunction = () => ItemEntity[];

type FeedCrowlerActions =
  | FeedCrowlerRequestAction
  | FeedBlogURLClearAction
  | FeedFetchRSSResponseAction
  | FeedFetchHatenaBookmarkCountsRequestAction
  | FeedFetchHatenaBookmarkCountsResponseAction
  | FeedFetchFacebookCountRequestAction
  | FeedFetchFacebookCountResponseAction
  | FeedCrowlerErrorAction
  | FeedSaveFeedFirebaseResponseAction
  | FeedSaveFeedFirebaseRequestAction
  | FeedFetchRSSRequestAction;

export type FeedActions = FeedBlogURLChangeAction | FeedFirebaseActions | FeedCrowlerActions;

type TA = ThunkAction<void, AppState, undefined, FeedFirebaseActions>;
export function fetchFirebaseBlog(auth: firebase.auth.Auth, blogURL: string): TA {
  return async dispatch => {
    let user;
    try {
      user = await currenUserOronAuthStateChanged(auth);
    } catch (e) {
      throw e;
    }
    try {
      dispatch(feedFirebaseBlogRequest(blogURL));
      const blog = await findBlog(user.uid, blogURL);
      dispatch(feedFirebaseBlogResponse(blogURL, blog, user));
    } catch (e) {
      dispatch(feedFirebaseBlogError(blogURL, e));
    }
  };
}
