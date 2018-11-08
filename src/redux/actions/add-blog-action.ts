import * as firebase from 'firebase/app';
import 'firebase/auth';

import { Dispatch, Action, ActionCreator, bindActionCreators } from 'redux';
import { fetchBlog } from '../../models/blog-fetcher';
import { fetchOrCurrenUser, currenUserOronAuthStateChanged } from './user-action';
import { saveBlog } from '../../models/repositories/blog-repository';
import { BlogResponse } from '../../models/responses';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../states/app-state';

export interface AddBlogRequestAction extends Action {
  type: 'AddBlogRequestAction';
}

function addBlogRequest(): AddBlogRequestAction {
  return {
    type: 'AddBlogRequestAction',
  }
};

export interface AddBlogResponseAction extends Action {
  type: 'AddBlogResponseAction';
  response: BlogResponse;
}

export function addBlogResponse(response: BlogResponse): AddBlogResponseAction {
  return {
    type: 'AddBlogResponseAction',
    response,
  };
}

export interface AddBlogErrorAction extends Action {
  type: 'AddBlogErrorAction';
  error: Error;
}

export function addBlogError(error: Error): AddBlogErrorAction {
  return {
    type: 'AddBlogErrorAction',
    error,
  }
};

export interface AddBlogInitializeAction extends Action {
  type: 'AddBlogInitializeAction';
}

export function addBlogInitialize(): AddBlogInitializeAction {
  return {
    type: 'AddBlogInitializeAction',
  }
};

type AddBlogFetchActions = AddBlogRequestAction | AddBlogResponseAction | AddBlogErrorAction;
export type AddBlogActions = AddBlogFetchActions | AddBlogInitializeAction;

export type AddBlogThunkAction = ThunkAction<void, AppState, undefined, AddBlogFetchActions>;
export function addBlog(auth: firebase.auth.Auth, blogURL: string): AddBlogThunkAction {
  return async (dispatch, getState) => {
    dispatch(addBlogRequest());
    const user = await currenUserOronAuthStateChanged(auth);
    try {
      const blogResponse = await fetchBlog(blogURL);
      if (user) {
        saveBlog(
          user.uid,
          blogResponse.url,
          blogResponse.title,
          blogResponse.feedURL,
          blogResponse.feedType
        );
        dispatch(addBlogResponse(blogResponse));
      } else {
        dispatch(addBlogError(new Error('Blog missing')));
      }
    } catch (e) {
      dispatch(addBlogError(e));
    }
  };
}