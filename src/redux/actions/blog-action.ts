import { Dispatch, Action, ActionCreator, bindActionCreators } from 'redux';

import { BlogEntity } from '../../models/entities';
import { fetchOrCurrenUser } from './user-action';
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

type BlogFirebaseFetchActions = BlogFirebaseRequestAction | BlogFirebaseResponseAction;

export function fetchBlogs (auth: firebase.auth.Auth): ThunkAction<void, AppState, undefined, BlogFirebaseFetchActions> {
  return (dispatch, getState) => {
    dispatch(fetchOrCurrenUser(auth, async (user) => {
      if (user) {
        dispatch(blogRequest());
        const blogs = await findAllBlogs(user.uid);
        dispatch(blogResponse(blogs));
      }
    }));
  };
}

export type BlogActions = BlogFirebaseRequestAction | BlogFirebaseResponseAction;
