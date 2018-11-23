import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as BlogRepo from '../../models/repositories/blog-repository';
import * as ItemsRepo from '../../models/repositories/item-repository';
import { AppState } from '../states/app-state';
import { currenUserOronAuthStateChanged } from './user-action';

export interface DeleteBlogRequestAction extends Action {
  type: 'DeleteBlogRequestAction';
  blogURL: string;
}

function deleteBlogRequest(blogURL: string): DeleteBlogRequestAction {
  return {
    type: 'DeleteBlogRequestAction',
    blogURL,
  };
}

export interface DeleteBlogResponseAction extends Action {
  type: 'DeleteBlogResponseAction';
  blogURL: string;
}

function deleteBlogResponse(blogURL: string): DeleteBlogResponseAction {
  return {
    type: 'DeleteBlogResponseAction',
    blogURL,
  };
}

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
  };
}

export interface DeleteBlogResetAction extends Action {
  type: 'DeleteBlogResetAction';
}

export function deleteBlogReset(): DeleteBlogResetAction {
  return {
    type: 'DeleteBlogResetAction',
  };
}

export type DeleteBlogActions =
  | DeleteBlogRequestAction
  | DeleteBlogResponseAction
  | DeleteBlogErrorAction
  | DeleteBlogResetAction;

type TA = ThunkAction<void, AppState, undefined, DeleteBlogActions>;
export function deleteBlog(auth: firebase.auth.Auth, blogURL: string): TA {
  return async dispatch => {
    try {
      const user = await currenUserOronAuthStateChanged(auth);
      dispatch(deleteBlogRequest(blogURL));
      await ItemsRepo.deleteItemsBatch(user.uid, blogURL);
      await BlogRepo.deleteBlog(user.uid, blogURL);
      dispatch(deleteBlogResponse(blogURL));
    } catch (e) {
      dispatch(deleteBlogError(blogURL, e));
    }
  };
}
