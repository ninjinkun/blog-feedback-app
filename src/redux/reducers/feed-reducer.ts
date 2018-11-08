import { Reducer, Action, AnyAction } from 'redux';
import { FeedsState, initialState as feedsIniticalState, FeedStates } from '../states/feeds-state';
import { FeedState, initialState } from '../states/feed-state';
import { FeedActions } from '../actions/feed-action';
import { AddBlogResponseAction } from '../actions/add-blog-action';
import { BlogFirebaseResponseAction } from '../actions/blog-action';

export const feedsReducer: Reducer<FeedsState> = (state = feedsIniticalState, action: FeedActions | Dummy | AddBlogResponseAction | BlogFirebaseResponseAction): FeedsState => {
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
      return updateFeed(blogURL, state, { crowlingLabel: 'Loading blog...', crowlingRatio: 10 });
    }
    case 'FeedFirebaseBlogResponseAction': {
      const { blogURL, blogEntity } = action;
      return updateFeed(blogURL, state, { title: blogEntity.title, crowlingLabel: 'Loading RSS...', crowlingRatio: 30 });
    }    
    case 'FeedFirebaseFeedItemsResponseAction': {
      const { blogURL, items } = action;
      return updateFeed(
        blogURL,
        state,
        { firebaseEntities: items, loading: false }
      );
    }
    case 'FeedFetchFeedItemsResponseAction': {
      const { blogURL, items } = action;
      return updateFeed(
        blogURL,
        state,
        { fethcedEntities: items, loading: false, crowlingLabel: 'Loading Hatena Bookmark...', crowlingRatio: 60 }
      );
    }
    case 'FeedFetchHatenaBookmarkCountsResponseAction': {
      const { blogURL, counts } = action;
      const flattenCount = [].concat.apply([], counts.filter(i => i));
      return updateFeed(
        blogURL,
        state,
        { fetchedHatenaBookmarkCounts: flattenCount, loading: false, crowlingLabel: 'Loading Facebook Shares...', crowlingRatio: 80 }
      );
    }
    case 'FeedFetchFacebookCountResponseAction': {
      const { blogURL, counts } = action;
      const flattenCount = [].concat.apply([], counts.filter(i => i));
      return updateFeed(
        blogURL,
        state,
        { fetchedFacebookCounts: flattenCount, loading: false, crowlingLabel: undefined, crowlingRatio: 100 }
      );
    }
    case 'FeedCrowlerErrorAction': {
      const { blogURL } = action;
      return updateFeed(blogURL, state, { crowlingLabel: undefined, crowlingRatio: 0 });   
    }
    case 'AddBlogResponseAction':
      const { title, url, feedURL } = action.response;
      return updateFeed(url, state, { title, feedURL });   

    case 'BlogFirebaseResponseAction':
      const { blogs } = action;      
      for (let blog of blogs) {
        const { title, url, feedURL } = blog;
        state = updateFeed(url, state, { title, feedURL });
      }
      return state;
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
