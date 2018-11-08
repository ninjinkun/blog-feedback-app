export type DeleteBlogState = {
  loading: boolean;
  blogURL?: string;
  error?: Error;
};

export const initialState: DeleteBlogState = {
  loading: false,
};