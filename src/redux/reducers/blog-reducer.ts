import { Reducer } from 'redux';
import { BlogActions, FIREBASE_BLOG_REQUEST, FIREBASE_BLOG_RESPONSE } from '../actions/blog-action';
import { DeleteBlogResponseAction } from '../actions/delete-blog-action';
import { FIREBASE_SIGNOUT_RESPONSE, UserSignoutActions } from '../actions/user-action';
import { BlogState, initialState } from '../states/blog-state';

export const blogReducer: Reducer<BlogState, BlogActions | UserSignoutActions | DeleteBlogResponseAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case FIREBASE_BLOG_REQUEST:
      return { ...state, loading: true };
    case FIREBASE_BLOG_RESPONSE: {
      const { blogs } = action;
      return { ...state, blogs, loading: false };
    }
    case 'DeleteBlogResponseAction': {
      const { blogURL } = action;
      let blogs;
      if (state.blogs) {
        blogs = state.blogs.filter(b => b.url !== blogURL);
      }
      return { ...state, blogs };
    }
    case FIREBASE_SIGNOUT_RESPONSE:
      return initialState;
    default:
      return state;
  }
};
