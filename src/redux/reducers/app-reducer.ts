import { combineReducers } from 'redux';
import { addBlogReducer } from './add-blog-reducer';
import { settingsReducer } from './setting-reducer';
import { userSlice } from '../states/user-state';
import { blogSlice } from '../states/blog-state';
import { deleteBlogSlice } from '../states/delete-blog-state';
import { feedsSlice } from '../states/feeds-state';

export const appReducer = combineReducers({
  blog: blogSlice.reducer,
  user: userSlice.reducer,
  addBlog: addBlogReducer,
  deleteBlog: deleteBlogSlice.reducer,
  feeds: feedsSlice.reducer,
  settings: settingsReducer,
});
