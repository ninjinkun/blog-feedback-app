import * as firebase from 'firebase/app';
import 'firebase/auth';

import { Dispatch, Action, ActionCreator, bindActionCreators } from 'redux';
import { fetchBlog } from '../../models/feed-fetcher';
import { fetchOrCurrenUser } from './user-action';
import { saveBlog } from '../../models/repositories/blog-repository';
import { BlogResponse } from '../../models/responses';

export interface AddBlogRequestAction extends Action {
  type: 'AddBlogRequestAction';
}

const addBlogRequest = (): AddBlogRequestAction => ({
  type: 'AddBlogRequestAction',
});

export interface AddBlogResponseAction extends Action {
  type: 'AddBlogResponseAction';
  response: BlogResponse;
}

export const addBlogResponse = (response: BlogResponse): AddBlogResponseAction => ({
  type: 'AddBlogResponseAction',
  response,
});

export interface AddBlogErrorAction extends Action {
  type: 'AddBlogErrorAction';
  error: Error;
}

export const addBlogError = (error: Error): AddBlogErrorAction => ({
  type: 'AddBlogErrorAction',
  error,
});

export type AddBlogActions = AddBlogRequestAction | AddBlogResponseAction | AddBlogErrorAction;

export const addBlog = (auth: firebase.auth.Auth, blogURL: string) =>
  (dispatch: Dispatch<AddBlogActions>) => {
    dispatch(addBlogRequest());
    fetchOrCurrenUser(auth, dispatch, async (user: firebase.User | null) => {
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
    });
  };