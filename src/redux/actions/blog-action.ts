import { ThunkAction } from 'redux-thunk';
import { BlogEntity } from '../../models/entities';
import { findAllBlogs } from '../../models/repositories/blog-repository';
import { AppState } from '../states/app-state';
import { currenUserOronAuthStateChanged } from './user-action';

export const FIREBASE_BLOGS_REQUEST = 'blog/FIREBASE_REQUEST' as const;
export function blogFirebaseRequest() {
  return {
    type: FIREBASE_BLOGS_REQUEST,
  };
}

export const FIREBASE_BLOGS_RESPONSE = 'blog/FIREBASE_RESPONSE' as const;
export function blogFirebaseResponse(blogs: BlogEntity[]) {
  return {
    type: FIREBASE_BLOGS_RESPONSE,
    blogs,
  };
}

export const FIREBASE_BLOGS_ERROR = 'blog/FIREBASE_ERROR' as const;
export function blogFirebaseError(error: Error) {
  return {
    type: FIREBASE_BLOGS_ERROR,
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
