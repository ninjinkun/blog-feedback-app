import { combineReducers } from 'redux';
import { addBlogReducer } from './add-blog-reducer';
import { blogReducer } from './blog-reducer';
import { deleteBlogReducer } from './delete-blog-reducer';
import { feedsReducer } from './feed-reducer';
import { settingsReducer } from './setting-reducer';
import { userSlice } from '../states/user-state';

export const appReducer = combineReducers({
  blog: blogReducer,
  user: userSlice.reducer,
  addBlog: addBlogReducer,
  deleteBlog: deleteBlogReducer,
  feeds: feedsReducer,
  settings: settingsReducer,
});
