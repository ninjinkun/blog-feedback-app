import { createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import { currenUserOronAuthStateChanged } from "./user-state";
import * as BlogRepo from '../../models/repositories/blog-repository';
import * as ItemsRepo from '../../models/repositories/item-repository';

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

export const deleteBlogSlice = createSlice({
  name: 'deleteBlog',
  initialState,
  reducers: {
    deleteBlogRequest(state, action: PayloadAction<string>) {
      return { ...state, finished: false, loading: true };
    },
    deleteBlogResponse(state, action: PayloadAction<string>) {
      const blogURL = action.payload;
      return { ...state, error: undefined, finished: true, blogURL, loading: false };
    },
    deleteBlogError(state, action: PayloadAction<{ blogURL: string, error: Error }>) {
      const { error } = action.payload;
      return { ...state, error, finished: false, loading: false };
    },
    reset() {
      return initialState;
    }
  }
});

type TA = ThunkAction<void, DeleteBlogState, undefined, any>;
export function deleteBlog(auth: firebase.auth.Auth, blogURL: string): TA {
  return async (dispatch) => {
    try {
      const user = await currenUserOronAuthStateChanged(auth);
      dispatch(deleteBlogSlice.actions.deleteBlogRequest(blogURL));
      await ItemsRepo.deleteItemsBatch(user.uid, blogURL);
      await BlogRepo.deleteBlog(user.uid, blogURL);
      dispatch(deleteBlogSlice.actions.deleteBlogResponse(blogURL));
    } catch (error) {
      dispatch(deleteBlogSlice.actions.deleteBlogError({ blogURL, error } ));
    }
  };
}
