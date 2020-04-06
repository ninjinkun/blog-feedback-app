import { Reducer } from 'redux';
import { BlogActions, FIREBASE_BLOGS_REQUEST, FIREBASE_BLOGS_RESPONSE } from '../actions/blog-action';
import { DELETE_RESPONSE, DeleteBlogActions } from '../actions/delete-blog-action';
import { FIREBASE_SIGNOUT_RESPONSE, UserSignoutActions } from '../actions/user-action';
import { BlogState, initialState } from '../states/blog-state';

export const blogReducer: Reducer<BlogState, BlogActions | UserSignoutActions | DeleteBlogActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case FIREBASE_BLOGS_REQUEST:
      return { ...state, loading: true };
    case FIREBASE_BLOGS_RESPONSE: {
      const { blogs } = action;
      return { ...state, blogs, loading: false };
    }
    case DELETE_RESPONSE: {
      const { blogURL } = action;
      let blogs;
      if (state.blogs) {
        blogs = state.blogs.filter((b) => b.url !== blogURL);
      }
      return { ...state, blogs };
    }
    case FIREBASE_SIGNOUT_RESPONSE:
      return initialState;
    default:
      return state;
  }
};
