import { Reducer } from 'redux';
import { AddBlogState, initialState } from '../states/add-blog-state';
import { AddBlogActions } from '../actions/add-blog-action';
import { DeleteBlogState } from '../states/delete-blog-state';
import { DeleteBlogActions } from '../actions/delete-blog-action';

export const deleteBlogReducer: Reducer<DeleteBlogState, DeleteBlogActions> = (state = initialState, action) => {
  switch (action.type) {
    case 'DeleteBlogRequestAction':
      return { ...state, finished: false, loading: true };
    case 'DeleteBlogResponseAction':
      const { blogURL } = action;
      return { ...state, error: undefined, finished: true, blogURL: blogURL, loading: false };
    case 'DeleteBlogErrorAction':
      const { error } = action;
      return { ...state, error, finished: false, loading: false };
    case 'DeleteBlogResetAction':
      return initialState;
    default:
      return state;
  }
};