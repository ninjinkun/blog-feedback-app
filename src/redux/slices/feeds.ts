import { createSlice, PayloadAction, createNextState, ThunkAction } from '@reduxjs/toolkit';
import { BlogEntity, ItemEntity, Services } from '../../models/entities';
import { ItemResponse, CountResponse } from '../../models/responses';
import { flatten } from 'lodash';
import { blogSlice } from './blog';
import { currenUserOronAuthStateChanged } from './user';
import { findBlog } from '../../models/repositories/blog-repository';
import { settingsSlice } from './settings';

export type FeedState = {
  firebaseEntities?: ItemEntity[];
  fethcedEntities?: ItemResponse[];
  fetchedCountJsoonCounts?: CountResponse[];
  fetchedHatenaBookmarkCounts?: CountResponse[];
  fetchedHatenaStarCounts?: CountResponse[];
  fetchedFacebookCounts?: CountResponse[];
  fetchedPocketCounts?: CountResponse[];
  title?: string;
  services?: Services;
  sendReport?: boolean;
  loading: boolean;
  error?: Error;
  feedURL?: string;
  loadingRatio: number; // 0...100
  loadingLabel?: string;
};

export type FeedStates = { [key: string]: FeedState };

export type FeedsState = {
  feeds: FeedStates;
  currentBlogURL?: string;
};

export const feedInitialState = {
  loading: false,
  loadingRatio: 0,
};

export const initialState: FeedsState = {
  feeds: {},
  currentBlogURL: undefined,
};

export const feedsSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    changeBlogURL(state, action: PayloadAction<string>) {
      const blogURL = action.payload;
      return { ...state, currentBlogURL: blogURL };
    },
    clearBlogURL(state) {
      return { ...state, currentBlogURL: undefined };
    },
    startFetchAndSave(state, action: PayloadAction<{ auth: firebase.auth.Auth; blogURL: string }>) {
      const { blogURL } = action.payload;
      return updateFeed(blogURL, state, { loading: true });
    },
    firebaseBlogRequest(state, action: PayloadAction<string>) {
      const blogURL = action.payload;
      return updateFeed(blogURL, state, { loadingLabel: 'ブログを読み込んでいます', loadingRatio: 10 });
    },
    firebaseBlogResponse(state, action: PayloadAction<{ blogURL: string; blogEntity: BlogEntity }>) {
      const { blogURL, blogEntity } = action.payload;
      return updateFeed(blogURL, state, {
        title: blogEntity.title,
        services: blogEntity.services,
        sendReport: blogEntity.sendReport,
      });
    },
    firebaseBlogError(state, action: PayloadAction<{ blogURL: string; error: Error }>) {
      return state;
    },
    firebaseFeedRequest(state, action: PayloadAction<string>) {
      return state;
    },
    firebaseFeedResponse(state, action: PayloadAction<{ blogURL: string; items: ItemEntity[] }>) {
      const { blogURL, items } = action.payload;
      return updateFeed(blogURL, state, { firebaseEntities: items });
    },
    fetchRSSRequest(state, action: PayloadAction<string>) {
      const blogURL = action.payload;
      return updateFeed(blogURL, state, { loadingLabel: 'RSSを読み込んでいます', loadingRatio: 30 });
    },
    fetchRSSResponse(state, action: PayloadAction<{ blogURL: string; items: ItemResponse[] }>) {
      const { blogURL, items } = action.payload;
      return updateFeed(blogURL, state, { fethcedEntities: items });
    },
    fetchRSSError(state, action: PayloadAction<{ blogURL: string; error: Error }>) {
      return state;
    },
    fetchCountJSOONCountRequest(state, action: PayloadAction<string>) {
      const blogURL = action.payload;
      return updateFeed(blogURL, state, { loadingLabel: 'シェア数を読み込んでいます', loadingRatio: 60 });
    },
    fetchCountJSOONCountResponse(state, action: PayloadAction<{ blogURL: string; counts: CountResponse[] }>) {
      const { blogURL, counts } = action.payload;
      return updateFeed(blogURL, state, { fetchedCountJsoonCounts: flatten(counts) });
    },
    fetchCountJSOONCountError(state, action: PayloadAction<{ blogURL: string; error: Error }>) {
      return state;
    },

    fetchHatenaBookmarkCountRequest(state, action: PayloadAction<string>) {
      const blogURL = action.payload;
      return updateFeed(blogURL, state, { loadingLabel: 'シェア数を読み込んでいます', loadingRatio: 60 });
    },
    fetchHatenaBookmarkCountResponse(state, action: PayloadAction<{ blogURL: string; counts: CountResponse[] }>) {
      const { blogURL, counts } = action.payload;
      return updateFeed(blogURL, state, { fetchedHatenaBookmarkCounts: flatten(counts) });
    },
    fetchHatenaBookmarkCountError(state, action: PayloadAction<{ blogURL: string; error: Error }>) {
      return state;
    },

    fetchHatenaStarCountRequest(state, action: PayloadAction<string>) {
      const blogURL = action.payload;
      return updateFeed(blogURL, state, { loadingLabel: 'シェア数を読み込んでいます', loadingRatio: 60 });
    },
    fetchHatenaStarCountResponse(state, action: PayloadAction<{ blogURL: string; counts: CountResponse[] }>) {
      const { blogURL, counts } = action.payload;
      return updateFeed(blogURL, state, { fetchedHatenaStarCounts: flatten(counts) });
    },
    fetchHatenaStarCountError(state, action: PayloadAction<{ blogURL: string; error: Error }>) {
      return state;
    },

    fetchFacebookCountsRequest(state, action: PayloadAction<string>) {
      const blogURL = action.payload;
      return updateFeed(blogURL, state, { loadingLabel: 'シェア数を読み込んでいます', loadingRatio: 60 });
    },
    fetchFacebookCountError(state, action: PayloadAction<{ blogURL: string; error: Error }>) {
      return state;
    },
    fetchFacebookCountResponse(state, action: PayloadAction<{ blogURL: string; counts: CountResponse[] }>) {
      const { blogURL, counts } = action.payload;
      return updateFeed(blogURL, state, { fetchedFacebookCounts: flatten(counts) });
    },
    fetchPocketCountRequest(state, action: PayloadAction<string>) {
      const blogURL = action.payload;
      return updateFeed(blogURL, state, { loadingLabel: 'シェア数を読み込んでいます', loadingRatio: 60 });
    },
    fetchPocketCountResponse(state, action: PayloadAction<{ blogURL: string; counts: CountResponse[] }>) {
      const { blogURL, counts } = action.payload;
      return updateFeed(blogURL, state, { fetchedPocketCounts: flatten(counts) });
    },
    fetchPocketCountError(state, action: PayloadAction<{ blogURL: string; error: Error }>) {
      return state;
    },
    firebaseSaveRequst(
      state,
      action: PayloadAction<{
        blogURL: string;
        firebaseItems: ItemEntity[];
        fetchedItems: ItemResponse[];
        counts: CountResponse[];
      }>
    ) {
      const { blogURL } = action.payload;
      return updateFeed(blogURL, state, { loadingLabel: 'データを保存しています', loadingRatio: 80 });
    },
    firebaseSaveResponse(state, action: PayloadAction<string>) {
      const blogURL = action.payload;
      return updateFeed(blogURL, state, { loading: false, loadingLabel: undefined, loadingRatio: 100 });
    },
    firebaseSaveError(state, action: PayloadAction<{ blogURL: string; error: Error }>) {
      const { blogURL } = action.payload;
      return updateFeed(blogURL, state, { loading: false, loadingLabel: undefined, loadingRatio: 0 });
    },
    fetchAndSaveError(state, action: PayloadAction<{ blogURL: string; error: Error }>) {
      const { blogURL } = action.payload;
      return updateFeed(blogURL, state, { loading: false, loadingLabel: undefined, loadingRatio: 0 });
    },
    firebaseAddBlogResponse(state, action: PayloadAction<{ title: string; url: string; feedURL: string }>) {
      const { title, url, feedURL } = action.payload;
      return updateFeed(url, state, { title, feedURL });
    },
  },
  extraReducers(builder) {
    builder.addCase(blogSlice.actions.firebaseBlogsResponse, (draft, action) => {
      const blogs = action.payload;
      for (const blog of blogs) {
        const { title, url, feedURL } = blog;
        draft = updateFeed(url, draft, { title, feedURL });
      }
      return draft;
    });
    builder.addCase(settingsSlice.actions.saveSettingResponse, (draft, action) => {
      const { blogURL, twitter, countjsoon, facebook, hatenabookmark, hatenastar, pocket, sendReport } = action.payload;
      const services: Services = { twitter, countjsoon, facebook, hatenabookmark, hatenastar, pocket };

      return updateFeed(blogURL, draft, { services, sendReport });
    });
  },
});

function updateFeed(blogURL: string, state: FeedsState, newFeed: Partial<FeedState>): FeedsState {
  if (!blogURL) {
    return state;
  }
  const feedState = state.feeds[blogURL] || feedInitialState;
  return createNextState(state, (draft) => {
    const newFeeds = draft.feeds;
    newFeeds[blogURL] = { ...feedState, ...newFeed };
    draft.feeds = newFeeds;
  });
}

type TA = ThunkAction<void, FeedState, undefined, any>;
export function fetchFirebaseBlog(auth: firebase.auth.Auth, blogURL: string): TA {
  return async (dispatch) => {
    let user;
    try {
      user = await currenUserOronAuthStateChanged(auth);
    } catch (e) {
      throw e;
    }
    try {
      dispatch(feedsSlice.actions.firebaseBlogRequest(blogURL));
      const blogEntity = await findBlog(user.uid, blogURL);
      dispatch(feedsSlice.actions.firebaseBlogResponse({ blogURL, blogEntity }));
    } catch (error) {
      dispatch(feedsSlice.actions.firebaseBlogError({ blogURL, error }));
    }
  };
}
