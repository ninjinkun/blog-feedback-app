import { combineReducers } from 'redux';
import { userSlice } from './slices/user-state';
import { blogSlice } from './slices/blog-state';
import { deleteBlogSlice } from './slices/delete-blog-state';
import { feedsSlice } from './slices/feeds-state';
import { addBlogSlice } from './slices/add-blog-state';
import { settingsSlice } from './slices/settings-state';

export const appReducer = combineReducers({
  blog: blogSlice.reducer,
  user: userSlice.reducer,
  addBlog: addBlogSlice.reducer,
  deleteBlog: deleteBlogSlice.reducer,
  feeds: feedsSlice.reducer,
  settings: settingsSlice.reducer,
});

export type AppState = ReturnType<typeof appReducer>