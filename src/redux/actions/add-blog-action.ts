import firebase from 'firebase/app';
import 'firebase/auth';

import { ThunkAction } from 'redux-thunk';
import { fetchBlog } from '../../models/fetchers/blog-fetcher';
import { fetchFeed } from '../../models/fetchers/feed-fetcher';
import { saveBlog } from '../../models/repositories/blog-repository';
import { BlogResponse, FeedResponse } from '../../models/responses';
import { AppState } from '../states/app-state';
import { currenUserOronAuthStateChanged } from './user-action';

export const FETCH_BLOG_REQUEST = 'addblog/FETCH_BLOG_REQUEST';
function addBlogFetchBlogRequest() {
  return {
    type: FETCH_BLOG_REQUEST as typeof FETCH_BLOG_REQUEST,
  };
}

export const FETCH_BLOG_RESPONSE = 'addblog/FETCH_BLOG_RESPONSE';
function addBlogFetchBlogResponse(blog: BlogResponse) {
  return {
    type: FETCH_BLOG_RESPONSE as typeof FETCH_BLOG_RESPONSE,
    blog,
  };
}

export const FETCH_FEED_REQUEST = 'addblog/FETCH_FEED_REQUEST';
function addBlogFetchFeedRequest() {
  return {
    type: FETCH_FEED_REQUEST as typeof FETCH_FEED_REQUEST,
  };
}

export const FETCH_FEED_RESPONSE = 'addblog/FETCH_FEED_RESPONSE';
function addBlogFetchFeedResponse(feed: FeedResponse) {
  return {
    type: FETCH_FEED_RESPONSE as typeof FETCH_FEED_RESPONSE,
    feed,
  };
}

export const FETCH_FEED_ERROR = 'addblog/FETCH_FEED_ERROR';
export function addBlogFetchFeedError(error: Error) {
  return {
    type: FETCH_FEED_ERROR as typeof FETCH_FEED_ERROR,
    error,
  };
}

export const FIREBASE_ADD_BLOG_REQUEST = 'addblog/FIREBASE_SAVE_REQUEST';
function addBlogFirebaseSaveRequest() {
  return {
    type: FIREBASE_ADD_BLOG_REQUEST as typeof FIREBASE_ADD_BLOG_REQUEST,
  };
}

export const FIREBASE_ADD_BLOG_RESPONSE = 'addblog/FIREBASE_SAVE_RESPONSE';
export function addBlogFirebaseSaveResponse(response: BlogResponse) {
  return {
    type: FIREBASE_ADD_BLOG_RESPONSE as typeof FIREBASE_ADD_BLOG_RESPONSE,
    response,
  };
}

export const FIREBASE_ADD_BLOG_ERROR = 'addblog/FIREBASE_SAVE_ERROR';
export function addBlogFirebaseSaveError(error: Error) {
  return {
    type: FIREBASE_ADD_BLOG_ERROR as typeof FIREBASE_ADD_BLOG_ERROR,
    error,
  };
}

export const ADD_BLOG_INITIALIZE = 'addblog/INITIALIZE';
export function addBlogInitialize() {
  return {
    type: ADD_BLOG_INITIALIZE as typeof ADD_BLOG_INITIALIZE,
  };
}

type AddBlogFetchActions =
  | ReturnType<typeof addBlogFetchBlogRequest>
  | ReturnType<typeof addBlogFetchBlogResponse>
  | ReturnType<typeof addBlogFetchFeedRequest>
  | ReturnType<typeof addBlogFetchFeedResponse>
  | ReturnType<typeof addBlogFetchFeedError>
  | ReturnType<typeof addBlogFirebaseSaveRequest>
  | ReturnType<typeof addBlogFirebaseSaveResponse>
  | ReturnType<typeof addBlogFirebaseSaveError>;
export type AddBlogActions = AddBlogFetchActions | ReturnType<typeof addBlogInitialize>;

export type AddBlogThunkAction = ThunkAction<void, AppState, undefined, AddBlogFetchActions>;
export function addBlog(auth: firebase.auth.Auth, blogURL: string, reportMailEnabled: boolean): AddBlogThunkAction {
  return async dispatch => {
    const user = await currenUserOronAuthStateChanged(auth);
    let blogResponse: BlogResponse | undefined;
    try {
      dispatch(addBlogFetchBlogRequest());
      const response = await fetchBlog(blogURL);
      dispatch(addBlogFetchBlogResponse(response));

      blogResponse = response;
    } catch (e) {
      try {
        dispatch(addBlogFetchFeedRequest());
        const feed = await fetchFeed(blogURL);
        dispatch(addBlogFetchFeedResponse(feed));

        const { url, title, feedType } = feed;
        blogResponse = {
          url,
          title,
          feedURL: blogURL,
          feedType,
          isHatenaBlog: false,
        };
      } catch (e) {
        dispatch(addBlogFetchFeedError(new Error('No blog ' + e)));
      }
    }

    if (user && blogResponse) {
      dispatch(addBlogFirebaseSaveRequest());
      // default services are Twitter, Facebook and HatenaBookmark. (HatenaStar is only HatenaBlog)
      await saveBlog(
        user.uid,
        blogResponse.url,
        blogResponse.title,
        blogResponse.feedURL,
        blogResponse.feedType,
        reportMailEnabled,
        true,
        false,
        true,
        true,
        blogResponse.isHatenaBlog,
        true
      );
      dispatch(addBlogFirebaseSaveResponse(blogResponse));
    } else {
      dispatch(addBlogFirebaseSaveError(new Error('Blog missing')));
    }
  };
}
