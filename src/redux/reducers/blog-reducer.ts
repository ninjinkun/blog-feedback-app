import { Reducer } from 'redux';
import { BlogState, initialState } from '../states/blog-state';
import { BlogActions } from '../actions/blog-action';

export const blogReducer: Reducer<BlogState> = (state = initialState, action: BlogActions) => {
  switch (action.type) {
    case 'BlogFirebaseRequestAction':
      return { ...state, loading: true };
    case 'BlogFirebaseResponseAction':
      const { blogs } = action;
      return { ...state, blogs, loading: false };
    default:
      return state;
  }
};