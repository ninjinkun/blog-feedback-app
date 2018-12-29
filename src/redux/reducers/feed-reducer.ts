import flatten from 'lodash/flatten';
import { Reducer } from 'redux';
import { AddBlogActions, FIREBASE_ADD_BLOG_RESPONSE } from '../actions/add-blog-action';
import { BlogActions, FIREBASE_BLOGS_RESPONSE } from '../actions/blog-action';
import {
  BLOG_URL_CHANGE,
  BLOG_URL_CLEAR,
  FEED_FETCH_AND_SAVE_ERROR,
  FeedActions,
  FETCH_AND_SAVE_START,
} from '../actions/feed-action';
import { FETCH_FACEBOOK_COUNT_REQUEST, FETCH_FACEBOOK_COUNT_RESPONSE } from '../actions/feed-actions/facebook-action';
import {
  FIREBASE_BLOG_REQUEST,
  FIREBASE_BLOG_RESPONSE,
  FIREBASE_FEED_RESPONSE,
} from '../actions/feed-actions/feed-firebase-action';
import {
  FIREBASE_SAVE_ERROR,
  FIREBASE_SAVE_REQUEST,
  FIREBASE_SAVE_RESPONSE,
} from '../actions/feed-actions/feed-firebase-save-action';
import {
  FETCH_HATENA_BOOKMARK_COUNT_REQUEST,
  FETCH_HATENA_BOOKMARK_COUNT_RESPONSE,
} from '../actions/feed-actions/hatenabookmark-action';
import { FETCH_HATENA_STAR_COUNT_RESPONSE } from '../actions/feed-actions/hatenastar-action';
import { FETCH_POCKET_COUNT_RESPONSE } from '../actions/feed-actions/pocket-action';
import { FETCH_RSS_REQUEST, FETCH_RSS_RESPONSE } from '../actions/feed-actions/rss';
import { FeedState, initialState } from '../states/feed-state';
import { FeedsState, initialState as feedsIniticalState } from '../states/feeds-state';

export const feedsReducer: Reducer<FeedsState, FeedActions | AddBlogActions | BlogActions> = (
  state = feedsIniticalState,
  action
): FeedsState => {
  switch (action.type) {
    case BLOG_URL_CHANGE: {
      const { blogURL } = action;
      return { ...state, currentBlogURL: blogURL };
    }
    case BLOG_URL_CLEAR: {
      return { ...state, currentBlogURL: undefined };
    }
    case FETCH_AND_SAVE_START: {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loading: true });
    }
    case FIREBASE_BLOG_REQUEST: {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loadingLabel: 'ブログを読み込んでいます', loadingRatio: 10 });
    }
    case FIREBASE_BLOG_RESPONSE: {
      const { blogURL, blogEntity } = action;
      return updateFeed(blogURL, state, {
        title: blogEntity.title,
        services: blogEntity.services,
      });
    }
    case FIREBASE_FEED_RESPONSE: {
      const { blogURL, items } = action;
      return updateFeed(blogURL, state, { firebaseEntities: items });
    }
    case FETCH_RSS_REQUEST: {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loadingLabel: 'RSSを読み込んでいます', loadingRatio: 30 });
    }
    case FETCH_RSS_RESPONSE: {
      const { blogURL, items } = action;
      return updateFeed(blogURL, state, { fethcedEntities: items });
    }
    case FETCH_HATENA_BOOKMARK_COUNT_REQUEST: {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loadingLabel: 'シェア数を読み込んでいます', loadingRatio: 60 });
    }
    case FETCH_HATENA_BOOKMARK_COUNT_RESPONSE: {
      const { blogURL, counts } = action;
      return updateFeed(blogURL, state, { fetchedHatenaBookmarkCounts: flatten(counts) });
    }
    case FETCH_HATENA_STAR_COUNT_RESPONSE: {
      const { blogURL, counts } = action;
      return updateFeed(blogURL, state, { fetchedHatenaStarCounts: flatten(counts) });
    }
    case FETCH_FACEBOOK_COUNT_REQUEST: {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loadingLabel: 'シェア数を読み込んでいます', loadingRatio: 60 });
    }
    case FETCH_FACEBOOK_COUNT_RESPONSE: {
      const { blogURL, counts } = action;
      return updateFeed(blogURL, state, { fetchedFacebookCounts: flatten(counts) });
    }
    case FETCH_POCKET_COUNT_RESPONSE: {
      const { blogURL, counts } = action;
      return updateFeed(blogURL, state, { fetchedPocketCounts: flatten(counts) });
    }
    case FIREBASE_SAVE_REQUEST: {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loadingLabel: 'データを保存しています', loadingRatio: 80 });
    }
    case FIREBASE_SAVE_RESPONSE: {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loading: false, loadingLabel: undefined, loadingRatio: 100 });
    }
    case FIREBASE_SAVE_ERROR: {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loading: false, loadingLabel: undefined, loadingRatio: 0 });
    }
    case FEED_FETCH_AND_SAVE_ERROR: {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loading: false, loadingLabel: undefined, loadingRatio: 0 });
    }
    case FIREBASE_ADD_BLOG_RESPONSE: {
      const { title, url, feedURL } = action.response;
      return updateFeed(url, state, { title, feedURL });
    }
    case FIREBASE_BLOGS_RESPONSE: {
      const { blogs } = action;
      for (const blog of blogs) {
        const { title, url, feedURL } = blog;
        state = updateFeed(url, state, { title, feedURL });
      }
      return state;
    }
    default:
      return state;
  }
};

const updateFeed = (blogURL: string, state: FeedsState, newFeed: Partial<FeedState>): FeedsState => {
  if (!blogURL) {
    return state;
  }
  const feedState = state.feeds[blogURL] || initialState;
  const newFeedState = { ...feedState, ...newFeed };
  const newFeeds = state.feeds;
  newFeeds[blogURL] = newFeedState;
  return { ...state, feeds: newFeeds };
};
