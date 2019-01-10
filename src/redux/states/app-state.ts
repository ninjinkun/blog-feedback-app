import { AddBlogState, initialState as addBlogInitialState } from './add-blog-state';
import { BlogState, initialState as blogInitialState } from './blog-state';
import { DeleteBlogState, initialState as deleteBlogIniticalState } from './delete-blog-state';
import { FeedsState, initialState as feedsInitialState } from './feeds-state';
import { initialState as settingsInitialState, SettingsState } from './settings-state';
import { initialState as userInitialState, UserState } from './user-state';

export type AppState = {
  blog: BlogState;
  user: UserState;
  addBlog: AddBlogState;
  deleteBlog: DeleteBlogState;
  feeds: FeedsState;
  settings: SettingsState;
};

export const initialState: AppState = {
  blog: blogInitialState,
  user: userInitialState,
  addBlog: addBlogInitialState,
  deleteBlog: deleteBlogIniticalState,
  feeds: feedsInitialState,
  settings: settingsInitialState,
};
