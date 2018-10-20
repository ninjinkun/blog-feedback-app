export type AddBlogState = {
  loading: boolean;
  finished: boolean;
  blogURL?: string;
  error?: Error;
};

export const initialState: AddBlogState = {
  loading: false,
  finished: false,
};