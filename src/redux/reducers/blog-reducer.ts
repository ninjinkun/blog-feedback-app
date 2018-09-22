import { Reducer, AnyAction } from 'redux';
import { BlogState, initialState } from '../states/blog-state';
import { BlogActions } from '../actions/blog-action';

export const blogReducer: Reducer<BlogState> = (state = initialState, action: BlogActions) => {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case 'BlogReuqestAction':
      return newState;
    case 'BlogResponseAction':
      const { response } = action;
      newState.blogs = response;
      return newState;
    default:
      return newState;
  }
};