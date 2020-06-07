import { AddBlogState } from './add-blog-state';
import { BlogState } from './blog-state';
import { DeleteBlogState } from './delete-blog-state';
import { FeedsState } from './feeds-state';
import { SettingsState } from './settings-state';
import { UserState } from './user-state';

export type AppState = {
  blog: BlogState;
  user: UserState;
  addBlog: AddBlogState;
  deleteBlog: DeleteBlogState;
  feeds: FeedsState;
  settings: SettingsState;
};
