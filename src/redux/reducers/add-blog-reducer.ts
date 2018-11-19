import { Reducer } from 'redux';
import { AddBlogState, initialState } from '../states/add-blog-state';
import { AddBlogActions } from '../actions/add-blog-action';

export const addBlogReducer: Reducer<AddBlogState, AddBlogActions> = (state = initialState, action) => {
  switch (action.type) {
    case 'AddBlogRequestAction':
      return { ...state, finished: false, loading: true };
    case 'AddBlogResponseAction':
      const { url } = action.response;
      return { ...state, error: undefined, finished: true, blogURL: url, loading: false };
    case 'AddBlogErrorAction':
      const { error } = action;
      return { ...state, error, finished: false, loading: false };
    case 'AddBlogInitializeAction':
      return initialState;
    default:
      return state;
  }
};