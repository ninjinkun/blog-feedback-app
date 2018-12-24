import flatten from 'lodash/flatten';
import { Reducer } from 'redux';
import { AddBlogResponseAction } from '../actions/add-blog-action';
import { BlogFirebaseResponseAction } from '../actions/blog-action';
import { FeedActions } from '../actions/feed-action';
import { FeedState, initialState } from '../states/feed-state';
import { FeedsState, initialState as feedsIniticalState } from '../states/feeds-state';

export const feedsReducer: Reducer<FeedsState, FeedActions | AddBlogResponseAction | BlogFirebaseResponseAction> = (
  state = feedsIniticalState,
  action
): FeedsState => {
  switch (action.type) {
    case 'FeedBlogURLChangeAction': {
      const { blogURL } = action;
      return { ...state, currentBlogURL: blogURL };
    }
    case 'FeedBlogURLClearAction': {
      return { ...state, currentBlogURL: undefined };
    }
    case 'FeedFetchFeedAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loading: true });
    }
    case 'FeedFirebaseBlogRequestAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loadingLabel: 'ブログを読み込んでいます', loadingRatio: 10 });
    }
    case 'FeedFirebaseBlogResponseAction': {
      const { blogURL, blogEntity } = action;
      return updateFeed(blogURL, state, {
        title: blogEntity.title,
        services: blogEntity.services,
      });
    }
    case 'FeedFirebaseFeedItemsResponseAction': {
      const { blogURL, items } = action;
      return updateFeed(blogURL, state, { firebaseEntities: items });
    }
    case 'FeedFetchRSSRequestAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loadingLabel: 'RSSを読み込んでいます', loadingRatio: 30 });
    }
    case 'FeedFetchRSSResponseAction': {
      const { blogURL, items } = action;
      return updateFeed(blogURL, state, { fethcedEntities: items });
    }
    case 'FeedFetchHatenaBookmarkCountsRequestAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loadingLabel: 'はてなブックマークを読み込んでいます', loadingRatio: 50 });
    }
    case 'FeedFetchHatenaBookmarkCountsResponseAction': {
      const { blogURL, counts } = action;
      return updateFeed(blogURL, state, { fetchedHatenaBookmarkCounts: flatten(counts) });
    }
    case 'FeedFetchHatenaStarCountsResponseAction': {
      const { blogURL, counts } = action;
      return updateFeed(blogURL, state, { fetchedHatenaStarCounts: flatten(counts) });
    }
    case 'FeedFetchFacebookCountRequestAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loadingLabel: 'Facebookシェアを読み込んでいます', loadingRatio: 60 });
    }
    case 'FeedFetchFacebookCountResponseAction': {
      const { blogURL, counts } = action;
      return updateFeed(blogURL, state, { fetchedFacebookCounts: flatten(counts) });
    }
    case 'FeedSaveFeedFirebaseRequestAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loadingLabel: 'データを保存しています', loadingRatio: 80 });
    }
    case 'FeedSaveFeedFirebaseResponseAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loading: false, loadingLabel: undefined, loadingRatio: 100 });
    }
    case 'FeedCrowlerErrorAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loading: false, loadingLabel: undefined, loadingRatio: 0 });
    }
    case 'AddBlogResponseAction': {
      const { title, url, feedURL } = action.response;
      return updateFeed(url, state, { title, feedURL });
    }
    case 'BlogFirebaseResponseAction': {
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
