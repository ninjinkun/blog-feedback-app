import * as firebase from 'firebase/app';
import 'firebase/auth';

import { Action } from 'redux';
import { AppState } from '../states/app-state';
import { ThunkAction } from 'redux-thunk';
import { currenUserOronAuthStateChanged } from './user-action';
import * as BlogRepo from '../../models/repositories/blog-repository';

export interface DeleteBlogRequestAction extends Action {
  type: 'DeleteBlogRequestAction';
  blogURL: string;
}

function deleteBlogRequest(blogURL: string): DeleteBlogRequestAction {
  return {
    type: 'DeleteBlogRequestAction',
    blogURL,
  }
};

export interface DeleteBlogResponseAction extends Action {
  type: 'DeleteBlogResponseAction';
  blogURL: string;
}

function deleteBlogResponse(blogURL: string): DeleteBlogResponseAction {
  return {
    type: 'DeleteBlogResponseAction',
    blogURL,
  }
};

export interface DeleteBlogErrorAction extends Action {
  type: 'DeleteBlogErrorAction';
  blogURL: string;
  error: Error;
}

function deleteBlogError(blogURL: string, error: Error): DeleteBlogErrorAction {
  return {
    type: 'DeleteBlogErrorAction',
    blogURL,
    error,
  }
};

export interface DeleteBlogResetAction extends Action {
  type: 'DeleteBlogResetAction';
}

export function deleteBlogReset(): DeleteBlogResetAction {
  return {
    type: 'DeleteBlogResetAction',
  }
};

export type DeleteBlogActions = DeleteBlogRequestAction | DeleteBlogResponseAction | DeleteBlogErrorAction | DeleteBlogResetAction;

export function deleteBlog(auth: firebase.auth.Auth, blogURL: string): ThunkAction<void, AppState, undefined, DeleteBlogActions> {
  return async (dispatch, getState) => {
    try {
      const user = await currenUserOronAuthStateChanged(auth);
      dispatch(deleteBlogRequest(blogURL));
      await BlogRepo.deleteBlog(user.uid, blogURL);
      dispatch(deleteBlogResponse(blogURL));
    } catch (e) {
      dispatch(deleteBlogError(blogURL, e));
    }
  };
}