import { BlogState, initialState as blogInitialState } from './blog-state';

export type AppState = {
    blog: BlogState;
};

export const initialState: AppState = {
    blog: blogInitialState,
};
