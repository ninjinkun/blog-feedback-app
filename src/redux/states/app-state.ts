import { BlogState, initialState as blogInitialState } from './blog-state';
import { UserState, initialState as userInitialState } from './user-state';
import { AddBlogState, initialState as addBlogInitialState } from './add-blog-state';
import { FeedsState, initialState as feedsInitialState } from './feeds-state';

export type AppState = {
    blog: BlogState;
    user: UserState;
    addBlog: AddBlogState;
    feeds: FeedsState;
};

export const initialState: AppState = {
    blog: blogInitialState,
    user: userInitialState,
    addBlog: addBlogInitialState,
    feeds: feedsInitialState,
};
