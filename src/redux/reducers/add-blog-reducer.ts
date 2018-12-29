import { Reducer } from 'redux';
import {
  ADD_BLOG_INITIALIZE,
  AddBlogActions,
  FIREBASE_ADD_BLOG_ERROR,
  FIREBASE_ADD_BLOG_REQUEST,
  FIREBASE_ADD_BLOG_RESPONSE,
} from '../actions/add-blog-action';
import { AddBlogState, initialState } from '../states/add-blog-state';

export const addBlogReducer: Reducer<AddBlogState, AddBlogActions> = (state = initialState, action) => {
  switch (action.type) {
    case FIREBASE_ADD_BLOG_REQUEST:
      return { ...state, finished: false, loading: true };
    case FIREBASE_ADD_BLOG_RESPONSE:
      const { url } = action.response;
      return { ...state, error: undefined, finished: true, blogURL: url, loading: false };
    case FIREBASE_ADD_BLOG_ERROR:
      const { error } = action;
      return { ...state, error, finished: false, loading: false };
    case ADD_BLOG_INITIALIZE:
      return initialState;
    default:
      return state;
  }
};
