import { Reducer } from 'redux';
import { UserState, initialState } from '../states/user-state';
import { AddBlogActions } from '../actions/add-blog-action';

export const addBlogReducer: Reducer<UserState> = (state = initialState, action: AddBlogActions) => {
  switch (action.type) {
    case 'AddBlogRequestAction':
      return { ...state, finished: false, loading: true };
    case 'AddBlogResponseAction':
      const { url } = action.response;
      return { ...state, error: null, finished: true, blogURL: url, loading: false };
    case 'AddBlogErrorAction':
      const { error } = action;
      return { ...state, error, finished: false, loading: false };
    case 'AddBlogInitializeAction':
      return initialState;
    default:
      return state;
  }
};