import firebase from 'firebase/app';
import 'firebase/auth';
import { ThunkAction } from 'redux-thunk';
import * as BlogRepo from '../../models/repositories/blog-repository';
import * as ItemsRepo from '../../models/repositories/item-repository';
import { AppState } from '../states/app-state';
import { currenUserOronAuthStateChanged } from './user-action';

export const DELETE_REQUEST = 'deleteblog/DELETE_REQUEST';
function deleteBlogRequest(blogURL: string) {
  return {
    type: DELETE_REQUEST as typeof DELETE_REQUEST,
    blogURL,
  };
}

export const DELETE_RESPONSE = 'deleteblog/DELETE_RESPONSE';
function deleteBlogResponse(blogURL: string) {
  return {
    type: DELETE_RESPONSE as typeof DELETE_RESPONSE,
    blogURL,
  };
}

export const DELETE_ERROR = 'deleteblog/DELETE_ERROR';
function deleteBlogError(blogURL: string, error: Error) {
  return {
    type: DELETE_ERROR as typeof DELETE_ERROR,
    blogURL,
    error,
  };
}

export const RESET = 'deleteblog/RESET';
export function deleteBlogReset() {
  return {
    type: RESET as typeof RESET,
  };
}

export type DeleteBlogActions =
  | ReturnType<typeof deleteBlogRequest>
  | ReturnType<typeof deleteBlogResponse>
  | ReturnType<typeof deleteBlogError>
  | ReturnType<typeof deleteBlogReset>;

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
