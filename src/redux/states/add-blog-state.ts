export type AddBlogState = {
  loading: boolean;
  error?: Error;  
};

export const initialState: AddBlogState = {
  loading: false,
};