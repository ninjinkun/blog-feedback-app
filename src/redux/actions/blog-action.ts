import { Dispatch, Action, ActionCreator, bindActionCreators } from 'redux';

import { BlogEntity } from '../../models/entities';
import { currenUserOronAuthStateChanged } from './user-action';
import { findAllBlogs } from '../../models/repositories/blog-repository';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../states/app-state';

export interface BlogFirebaseRequestAction extends Action {
  type: 'BlogFirebaseRequestAction';
}

function blogRequest(): BlogFirebaseRequestAction {
  return {
    type: 'BlogFirebaseRequestAction',
  };
}

export interface BlogFirebaseResponseAction extends Action {
  type: 'BlogFirebaseResponseAction';
  blogs: BlogEntity[];
}

export function blogResponse(blogs: BlogEntity[]): BlogFirebaseResponseAction {
  return {
    type: 'BlogFirebaseResponseAction',
    blogs: blogs
  }
};

export interface BlogFirebaseErrorAction extends Action {
  type: 'BlogFirebaseErrorAction';
  error: Error;
}

export function blogFirebaseError(error: Error): BlogFirebaseErrorAction {
  return {
    type: 'BlogFirebaseErrorAction',
    error,
  };
}

type BlogFirebaseFetchActions = BlogFirebaseRequestAction | BlogFirebaseResponseAction | BlogFirebaseErrorAction;

export function fetchBlogs (auth: firebase.auth.Auth): ThunkAction<void, AppState, undefined, BlogFirebaseFetchActions> {
  return async (dispatch, getState) => {
    let user;
    try {
      user = await currenUserOronAuthStateChanged(auth);
    } catch (e) {
      throw e;
    }
    try {
      dispatch(blogRequest());
      const blogs = await findAllBlogs(user.uid);
      dispatch(blogResponse(blogs));
    } catch (e) {
      dispatch(blogFirebaseError(e));
    }
  };
}

export type BlogActions = BlogFirebaseFetchActions;
