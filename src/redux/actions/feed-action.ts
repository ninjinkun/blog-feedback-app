import * as firebase from 'firebase/app';
import 'firebase/auth';

import { Action } from 'redux';
import { ItemEntity, CountEntity, BlogEntity } from '../../models/entities';
import { BlogResponse, ItemResponse, CountResponse } from '../../models/responses';
import { findBlog } from '../../models/repositories/blog-repository';
import { currenUserOronAuthStateChanged } from './user-action';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../states/app-state';

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
  auth: firebase.auth.Auth
}

export function fetchFeed(blogURL: string, auth: firebase.auth.Auth): FeedFetchFeedAction {
  return {
    type: 'FeedFetchFeedAction',
    blogURL,
    auth
  }
}

export interface FeedUserResponseAction extends Action {
  type: 'FeedUserResponseAction';
  blogURL: string,
  user: firebase.User;
}

export function userResponse(blogURL: string, user: firebase.User): FeedUserResponseAction {
  return {
    type: 'FeedUserResponseAction',
    blogURL,
    user,
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
  }
}

export interface FeedFirebaseFeedItemsResponseAction extends Action {
  type: 'FeedFirebaseFeedItemsResponseAction';
  blogURL: string;
  items: ItemEntity[];
}

export function feedFirebaseFeedItemsResponse(blogURL: string, items: ItemEntity[]): FeedFirebaseFeedItemsResponseAction {
  return {
    type: 'FeedFirebaseFeedItemsResponseAction',
    blogURL,
    items,
  };
}

export interface FeedFirebaseBlogResponseAction extends Action {
  type: 'FeedFirebaseBlogResponseAction';
  blogURL: string;
  blogEntity: BlogEntity;
  user: firebase.User;
}

export function feedFirebaseBlogResponse(blogURL: string, blogEntity: BlogEntity, user: firebase.User) : FeedFirebaseBlogResponseAction {
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

export function feedFirebaseBlogError(blogURL: string, error: Error) : FeedFirebaseBlogErrorAction {
  return {
    type: 'FeedFirebaseBlogErrorAction',
    blogURL,
    error
  };
}

export type FeedFirebaseActions = FeedFetchFeedAction | FeedFirebaseBlogRequestAction | FeedFirebaseFeedItemsResponseAction | FeedFirebaseBlogResponseAction | FeedFirebaseBlogErrorAction;

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

export interface FeedCrowlerTitleResponseAction extends Action {
  type: 'FeedCrowlerTitleResponseAction';
  blogURL: string;
  title: string;
}

export function feedCrowlerTitleResponseAction(blogURL: string, title: string): FeedCrowlerTitleResponseAction {
  return {
    type: 'FeedCrowlerTitleResponseAction',
    blogURL,
    title,
  };
}

export interface FeedFetchFeedItemsResponseAction extends Action {
  type: 'FeedFetchFeedItemsResponseAction';
  blogURL: string;
  items: ItemResponse[];
}

export function feedCrowlerItemsResponse(blogURL: string, items: ItemResponse[]): FeedFetchFeedItemsResponseAction {
  return {
    type: 'FeedFetchFeedItemsResponseAction',
    blogURL,
    items,
  };
}

export interface FeedFetchHatenaBookmarkCountsResponseAction extends Action {
  type: 'FeedFetchHatenaBookmarkCountsResponseAction';
  blogURL: string;
  counts: CountResponse[];
}

export function feedFetchHatenaBookmarkCountsResponse(blogURL: string, counts: CountResponse[]): FeedFetchHatenaBookmarkCountsResponseAction {
  return {
    type: 'FeedFetchHatenaBookmarkCountsResponseAction',
    blogURL,
    counts,
  };
}


export interface FeedFetchFacebookCountResponseAction extends Action {
  type: 'FeedFetchFacebookCountResponseAction';
  blogURL: string;
  counts: CountResponse[];
}

export function feedFetchFacebookCountResponse(blogURL: string, counts: CountResponse[]): FeedFetchFacebookCountResponseAction {
  return {
    type: 'FeedFetchFacebookCountResponseAction',
    blogURL,
    counts,
  };
}

export interface FeedSaveFeedsResponseAction extends Action {
  type: 'FeedSaveFeedsResponseAction';
  blogURL: string;
}

export function feedSaveFeedsResponseAction(blogURL: string) {
  return {
    type: 'FeedSaveFeedsResponseAction',
    blogURL,
  }
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

type FeedCrowlerActions = FeedCrowlerRequestAction | FeedBlogURLClearAction | FeedCrowlerTitleResponseAction | FeedFetchFeedItemsResponseAction | FeedFetchHatenaBookmarkCountsResponseAction | FeedFetchFacebookCountResponseAction | FeedCrowlerErrorAction | FeedSaveFeedsResponseAction;

export type FeedActions = FeedBlogURLChangeAction | FeedFirebaseActions | FeedCrowlerActions;

export function fetchFirebaseBlog (auth: firebase.auth.Auth, blogURL: string): ThunkAction<void, AppState, undefined, FeedFirebaseActions> {
  return async (dispatch) => {
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
