import { Reducer } from 'redux';
import { DELETE_ERROR, DELETE_REQUEST, DELETE_RESPONSE, DeleteBlogActions, RESET } from '../actions/delete-blog-action';
import { initialState } from '../states/add-blog-state';
import { DeleteBlogState } from '../states/delete-blog-state';

export const deleteBlogReducer: Reducer<DeleteBlogState, DeleteBlogActions> = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_REQUEST:
      return { ...state, finished: false, loading: true };
    case DELETE_RESPONSE:
      const { blogURL } = action;
      return { ...state, error: undefined, finished: true, blogURL, loading: false };
    case DELETE_ERROR:
      const { error } = action;
      return { ...state, error, finished: false, loading: false };
    case RESET:
      return initialState;
    default:
      return state;
  }
};
