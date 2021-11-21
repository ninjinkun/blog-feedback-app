import { Auth } from '@firebase/auth';
import { BlogEntity } from '../../models/entities';
import { createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { currenUserOronAuthStateChanged } from './user';
import { findAllBlogs } from '../../models/repositories/blog-repository';
import { deleteBlogSlice } from './delete-blog';

export type BlogState = {
  blogs?: BlogEntity[];
  loading: boolean;
  error?: Error;
};

export const initialState: BlogState = {
  loading: false,
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    firebaseBlogsRequest(state) {
      return { ...state, loading: true };
    },
    firebaseBlogsResponse(state, action: PayloadAction<BlogEntity[]>) {
      return { ...state, blogs: action.payload, loading: false };
    },
    firebaseBlogsError(state, action: PayloadAction<Error>) {
      return state;
    },
  },
  extraReducers(builder) {
    builder.addCase(deleteBlogSlice.actions.deleteBlogResponse, (state, action: PayloadAction<string>) => {
      const blogURL = action.payload;
      let blogs;
      if (state.blogs) {
        blogs = state.blogs.filter((b) => b.url !== blogURL);
      }
      return { ...state, blogs };
    });
  },
});

export function fetchBlogs(auth: Auth): ThunkAction<void, BlogState, undefined, any> {
  return async (dispatch) => {
    let user;
    try {
      user = await currenUserOronAuthStateChanged(auth);
    } catch (e) {
      throw e;
    }
    try {
      dispatch(blogSlice.actions.firebaseBlogsRequest());
      const blogs = await findAllBlogs(user.uid);
      dispatch(blogSlice.actions.firebaseBlogsResponse(blogs));
    } catch (e) {
      if (e instanceof Error) {
        dispatch(blogSlice.actions.firebaseBlogsError(e));
      }
    }
  };
}
