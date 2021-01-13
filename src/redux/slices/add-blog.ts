import firebase from 'firebase/app';

import { createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { currenUserOronAuthStateChanged } from './user';
import { BlogResponse, FeedResponse } from '../../models/responses';
import { saveBlog } from '../../models/repositories/blog-repository';
import { fetchFeed } from '../../models/fetchers/feed-fetcher';
import { fetchBlog } from '../../models/fetchers/blog-fetcher';

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

export const addBlogSlice = createSlice({
  name: 'addBlog',
  initialState,
  reducers: {
    fetchBlogRequest() {},
    fetchBlogResponse(state, action: PayloadAction<BlogResponse>) {},
    fetchBlogError(state, action: PayloadAction<Error>) {},
    fetchFeedRequest() {},
    fetchFeedResponse(state, action: PayloadAction<FeedResponse>) {},
    fetchFeedError(state, action: PayloadAction<Error>) {},
    firebaseSaveRequst(state) {
      return { ...state, finished: false, loading: true };
    },
    firebaseSaveResponse(state, action: PayloadAction<{ blogURL: string }>) {
      const { blogURL } = action.payload;
      return { ...state, error: undefined, finished: true, blogURL, loading: false };
    },
    firebaseSaveError(state, action: PayloadAction<Error>) {
      const error = action.payload;
      return { ...state, error, finished: false, loading: false };
    },
    reset(state) {
      return initialState;
    },
  },
});

export type AddBlogThunkAction = ThunkAction<void, AddBlogState, undefined, any>;
export function addBlog(auth: firebase.auth.Auth, blogURL: string, reportMailEnabled: boolean): AddBlogThunkAction {
  return async (dispatch) => {
    const user = await currenUserOronAuthStateChanged(auth);
    let blogResponse: BlogResponse | undefined;
    try {
      dispatch(addBlogSlice.actions.fetchBlogRequest());
      const response = await fetchBlog(blogURL);
      dispatch(addBlogSlice.actions.fetchBlogResponse(response));

      blogResponse = response;
    } catch (e) {
      try {
        dispatch(addBlogSlice.actions.fetchFeedRequest());
        const feed = await fetchFeed(blogURL);
        dispatch(addBlogSlice.actions.fetchFeedResponse(feed));

        const { url, title, feedType } = feed;
        blogResponse = {
          url,
          title,
          feedURL: blogURL,
          feedType,
          isHatenaBlog: false,
        };
      } catch (e) {
        dispatch(addBlogSlice.actions.fetchFeedError(new Error('No blog ' + e)));
      }
    }

    if (user && blogResponse) {
      dispatch(addBlogSlice.actions.firebaseSaveRequst());
      // default services are Twitter, Facebook and HatenaBookmark. (HatenaStar is only HatenaBlog)
      await saveBlog(
        user.uid,
        blogResponse.url,
        blogResponse.title,
        blogResponse.feedURL,
        blogResponse.feedType,
        reportMailEnabled,
        true,
        false,
        true,
        true,
        blogResponse.isHatenaBlog,
        true
      );
      dispatch(addBlogSlice.actions.firebaseSaveResponse({ blogURL: blogResponse.url }));
    } else {
      dispatch(addBlogSlice.actions.firebaseSaveError(new Error('Blog missing')));
    }
  };
}
