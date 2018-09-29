import { Reducer, Action, AnyAction } from 'redux';
import { FeedsState, initialState as feedsIniticalState, FeedStates } from '../states/feeds-state';
import { FeedState, initialState } from '../states/feed-state';
import { FeedActions } from '../actions/feed-action';

export const feedsReducer: Reducer<FeedsState> = (state = feedsIniticalState, action: FeedActions | Dummy): FeedsState => {
  switch (action.type) {
    case 'FeedBlogURLChangeAction': {
      const { blogURL } = action;
      return { ...state, currentBlogURL: blogURL };
    }
    case 'FeedBlogURLClearAction': {
      return { ...state, currentBlogURL: undefined };
    }
    case 'FeedFirebaseRequestAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { loading: true });
    }
    case 'FeedFirebaseBlogTitleResponseAction': {
      const { blogURL, title } = action;
      return updateFeed(blogURL, state, { title });
    }
    case 'FeedFirebaseItemsResponseAction': {
      const { blogURL, items } = action;
      return updateFeed(
        blogURL,
        state,
        { firebaseEntities: items, loading: false }
      );
    }
    case 'FeedFirebaseCountsResponseAction': {
      const { blogURL, counts } = action;
      const flattenCount = [].concat.apply([], counts.filter(i => i));
      return updateFeed(
        blogURL,
        state,
        { firebaseCounts: flattenCount, loading: false }
      );
    }
    case 'FeedCrowlerRequestAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { crowlingLabel: 'Loading blog...', crowlingRatio: 10 });
    }
    case 'FeedCrowlerTitleResponseAction': {
      const { blogURL, title } = action;
      return updateFeed(blogURL, state, { title, crowlingLabel: 'Loading RSS...', crowlingRatio: 30 });
    }
    case 'FeedCrowlerItemsResponseAction': {
      const { blogURL, items } = action;
      return updateFeed(
        blogURL,
        state,
        { fethcedEntities: items, loading: false, crowlingLabel: 'Loading Hatena Bookmark...', crowlingRatio: 80 }
      );
    }
    case 'FeedCrowlerCountsResponseAction': {
      const { blogURL, counts } = action;
      const flattenCount = [].concat.apply([], counts.filter(i => i));
      return updateFeed(
        blogURL,
        state,
        { fetchedCounts: flattenCount, loading: false, crowlingLabel: undefined, crowlingRatio: 100 }
      );
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
  const newFeeds = { ...state.feeds };
  newFeeds[blogURL] = newFeedState;
  return { ...state, feeds: newFeeds };
};

// surpress type checking
interface Dummy extends Action {
  type: 'Dummy';
}
