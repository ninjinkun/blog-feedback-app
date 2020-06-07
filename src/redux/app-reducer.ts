import { combineReducers } from 'redux';
import { userSlice } from './slices/user';
import { blogSlice } from './slices/blog';
import { deleteBlogSlice } from './slices/delete-blog';
import { feedsSlice } from './slices/feeds';
import { addBlogSlice } from './slices/add-blog';
import { settingsSlice } from './slices/settings';

export const appReducer = combineReducers({
  blog: blogSlice.reducer,
  user: userSlice.reducer,
  addBlog: addBlogSlice.reducer,
  deleteBlog: deleteBlogSlice.reducer,
  feeds: feedsSlice.reducer,
  settings: settingsSlice.reducer,
});

export type AppState = ReturnType<typeof appReducer>;
