import { Reducer, Action, AnyAction } from 'redux';
import { FeedsState, initialState as feedsIniticalState, FeedStates } from '../states/feeds-state';
import { FeedState, initialState } from '../states/feed-state';
import { FeedActions } from '../actions/feed-action';
import { AddBlogResponseAction } from '../actions/add-blog-action';
import { BlogFirebaseResponseAction } from '../actions/blog-action';

export const feedsReducer: Reducer<FeedsState, FeedActions | AddBlogResponseAction | BlogFirebaseResponseAction> = (state = feedsIniticalState, action): FeedsState => {
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
      return updateFeed(blogURL, state, { crowlingLabel: 'ブログを読み込んでいます', crowlingRatio: 10 });
    }
    case 'FeedFirebaseBlogResponseAction': {
      const { blogURL, blogEntity } = action;
      return updateFeed(blogURL, state, { title: blogEntity.title });
    }
    case 'FeedFirebaseFeedItemsResponseAction': {
      const { blogURL, items } = action;
      return updateFeed(
        blogURL,
        state,
        { firebaseEntities: items }
      );
    }
    case 'FeedFetchRSSRequestAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { crowlingLabel: 'RSSを読み込んでいます', crowlingRatio: 30 });
    }
    case 'FeedFetchRSSResponseAction': {
      const { blogURL, items } = action;
      return updateFeed(
        blogURL,
        state,
        { fethcedEntities: items }
      );
    }
    case 'FeedFetchHatenaBookmarkCountsRequestAction': {
      const { blogURL } = action;
      return updateFeed(
        blogURL,
        state,
        { crowlingLabel: 'はてなブックマークを読み込んでいます', crowlingRatio: 50 }
      );
    }
    case 'FeedFetchHatenaBookmarkCountsResponseAction': {
      const { blogURL, counts } = action;
      const flattenCount = [].concat.apply([], counts.filter(i => i));
      return updateFeed(
        blogURL,
        state,
        { fetchedHatenaBookmarkCounts: flattenCount }
      );
    }
    case 'FeedFetchFacebookCountRequestAction': {
      const { blogURL } = action;
      return updateFeed(
        blogURL,
        state,
        { crowlingLabel: 'Facebookシェアを読み込んでいます', crowlingRatio: 60 }
      );
    }
    case 'FeedFetchFacebookCountResponseAction': {
      const { blogURL, counts } = action;
      const flattenCount = [].concat.apply([], counts.filter(i => i));
      return updateFeed(
        blogURL,
        state,
        { fetchedFacebookCounts: flattenCount }
      );
    }
    case 'FeedSaveFeedFirebaseRequestAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { crowlingLabel: 'データを保存しています', crowlingRatio: 80 });
    }
    case 'FeedSaveFeedFirebaseResponseAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loading: false, crowlingLabel: undefined, crowlingRatio: 100 });
    }
    case 'FeedCrowlerErrorAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loading: false, crowlingLabel: undefined, crowlingRatio: 0 });
    }
    case 'AddBlogResponseAction': {
      const { title, url, feedURL } = action.response;
      return updateFeed(url, state, { title, feedURL });
    }
    case 'BlogFirebaseResponseAction': {
      const { blogs } = action;
      for (let blog of blogs) {
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

// surpress type checking
interface Dummy extends Action {
  type: 'Dummy';
}
