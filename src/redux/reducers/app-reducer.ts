import { combineReducers } from 'redux';
import { userSlice } from '../states/user-state';
import { blogSlice } from '../states/blog-state';
import { deleteBlogSlice } from '../states/delete-blog-state';
import { feedsSlice } from '../states/feeds-state';
import { addBlogSlice } from '../states/add-blog-state';
import { settingsSlice } from '../states/settings-state';

export const appReducer = combineReducers({
  blog: blogSlice.reducer,
  user: userSlice.reducer,
  addBlog: addBlogSlice.reducer,
  deleteBlog: deleteBlogSlice.reducer,
  feeds: feedsSlice.reducer,
  settings: settingsSlice.reducer,
});
