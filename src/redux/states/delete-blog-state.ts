export type DeleteBlogState = {
  loading: boolean;
  blogURL?: string;
  finished: boolean;
  error?: Error;
};

export const initialState: DeleteBlogState = {
  loading: false,
  finished: false,
};