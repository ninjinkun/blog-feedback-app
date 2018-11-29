import { Reducer } from 'redux';
import { BlogActions } from '../actions/blog-action';
import { DeleteBlogResponseAction } from '../actions/delete-blog-action';
import { UserFirebaseSignoutResponseAction } from '../actions/user-action';
import { BlogState, initialState } from '../states/blog-state';

export const blogReducer: Reducer<
  BlogState,
  BlogActions | UserFirebaseSignoutResponseAction | DeleteBlogResponseAction
> = (state = initialState, action) => {
  switch (action.type) {
    case 'BlogFirebaseRequestAction':
      return { ...state, loading: true };
    case 'BlogFirebaseResponseAction': {
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
    case 'UserFirebaseSignoutResponseAction':
      return initialState;
    default:
      return state;
  }
};
