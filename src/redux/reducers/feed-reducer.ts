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
    case 'FeedCrowlerTitleResponseAction': {
      const { blogURL, title } = action;
      return updateFeed(blogURL, state, { title });
    }
    case 'FeedCrowlerItemsResponseAction': {
      const { blogURL, items } = action;
      return updateFeed(
        blogURL,
        state,
        { fethcedEntities: items, loading: false }
      );
    }
    case 'FeedCrowlerCountsResponseAction': {
      const { blogURL, counts } = action;
      const flattenCount = [].concat.apply([], counts.filter(i => i));
      return updateFeed(
        blogURL,
        state,
        { fetchedCounts: flattenCount, loading: false }
      );
    }

    default:
      return state;
  }
};

const updateFeed = (blogURL: string, state: FeedsState, newFeed: Partial<FeedState>): FeedsState => {
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
