import { Action } from 'redux';

import { ThunkAction } from 'redux-thunk';
import { BlogEntity } from '../../models/entities';
import { findAllBlogs } from '../../models/repositories/blog-repository';
import { AppState } from '../states/app-state';
import { currenUserOronAuthStateChanged } from './user-action';

export const FIREBASE_BLOG_REQUEST = 'blog/FIREBASE_REQUEST';
export function blogFirebaseRequest() {
  return {
    type: FIREBASE_BLOG_REQUEST as typeof FIREBASE_BLOG_REQUEST,
  };
}

export const FIREBASE_BLOG_RESPONSE = 'blog/FIREBASE_RESPONSE';
export function blogFirebaseResponse(blogs: BlogEntity[]) {
  return {
    type: FIREBASE_BLOG_RESPONSE as typeof FIREBASE_BLOG_RESPONSE,
    blogs,
  };
}

export const FIREBASE_BLOG_ERROR = 'blog/FIREBASE_ERROR';
export function blogFirebaseError(error: Error) {
  return {
    type: FIREBASE_BLOG_ERROR as typeof FIREBASE_BLOG_ERROR,
    error,
  };
}

type BlogFirebaseFetchActions =
  | ReturnType<typeof blogFirebaseRequest>
  | ReturnType<typeof blogFirebaseResponse>
  | ReturnType<typeof blogFirebaseError>;

export function fetchBlogs(auth: firebase.auth.Auth): ThunkAction<void, AppState, undefined, BlogFirebaseFetchActions> {
  return async dispatch => {
    let user;
    try {
      user = await currenUserOronAuthStateChanged(auth);
    } catch (e) {
      throw e;
    }
    try {
      dispatch(blogFirebaseRequest());
      const blogs = await findAllBlogs(user.uid);
      dispatch(blogFirebaseResponse(blogs));
    } catch (e) {
      dispatch(blogFirebaseError(e));
    }
  };
}

export type BlogActions = BlogFirebaseFetchActions;
