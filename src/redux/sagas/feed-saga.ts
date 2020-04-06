import { clone } from 'lodash';
import flatten from 'lodash/flatten';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { CountType } from '../../models/consts/count-type';
import { BlogEntity, ItemEntity } from '../../models/entities';
import { fetchFeed as fetchFeedAction } from '../../models/fetchers/feed-fetcher';
import { findBlog } from '../../models/repositories/blog-repository';
import { findAllItems } from '../../models/repositories/item-repository';
import { CountResponse, FeedResponse, ItemResponse } from '../../models/responses';
import { saveFeedsAndCounts } from '../../models/save-count-response';
import { feedFetchAndSaveError, FeedFetchFeedAction, FETCH_AND_SAVE_START } from '../actions/feed-action';
import {
  feedFirebaseBlogRequest,
  feedFirebaseBlogResponse,
  feedFirebaseFeedItemsResponse,
} from '../actions/feed-actions/feed-firebase-action';
import {
  feedFirebaseSaveError,
  feedSaveFeedFirebaseResponse,
  feedSaveFeedRequest,
} from '../actions/feed-actions/feed-firebase-save-action';
import { feedFetchRSSError, feedFetchRSSRequest, feedFetchRSSResponse } from '../actions/feed-actions/rss';
import { fetchCountJsoonCounts } from './feed-sagas/count-jsoon-saga';
import { fetchFacebookCounts } from './feed-sagas/facebook-saga';
import { fetchHatenaBookmarkCounts } from './feed-sagas/hatenabookmark-saga';
import { fetchHatenaStarCounts } from './feed-sagas/hatenastar-saga';
import { fetchPocketCounts } from './feed-sagas/pocket-saga';
import { fetchFiresbaseUser } from './user-saga';

export default function* feedSaga() {
  yield takeLatest(FETCH_AND_SAVE_START, handleFetchAction);
}

// main
function* handleFetchAction(action: FeedFetchFeedAction) {
  const { blogURL, auth } = action;

  const user: firebase.User = yield call(fetchFiresbaseUser, auth);

  const blogEntity: BlogEntity = yield call(firebaseBlog, user, blogURL);
  const { services, feedURL } = blogEntity;

  const [firebaseItems, fetchedItems]: [ItemEntity[], ItemResponse[]] = yield all([
    call(firebaseFeed, user, blogURL),
    call(fetchFeed, blogURL, feedURL),
  ]);

  const urls = fetchedItems.map((i) => i.url);
  const countServices = [];
  const countTypes: CountType[] = [];
  if (services) {
    const { countjsoon, hatenabookmark, hatenastar, pocket, facebook } = services;
    if (countjsoon) {
      countServices.push(call(fetchCountJsoonCounts, blogURL, urls));
      countTypes.push(CountType.CountJsoon);
    }
    if (hatenabookmark) {
      countServices.push(call(fetchHatenaBookmarkCounts, blogURL, urls));
      countTypes.push(CountType.HatenaBookmark);
    }
    if (hatenastar) {
      countServices.push(call(fetchHatenaStarCounts, blogURL, urls));
      countTypes.push(CountType.HatenaStar);
    }
    if (pocket) {
      countServices.push(call(fetchPocketCounts, blogURL, urls));
      countTypes.push(CountType.Pocket);
    }
    if (facebook) {
      countServices.push(call(fetchFacebookCounts, blogURL, urls));
      countTypes.push(CountType.Facebook);
    }
  }

  const counts: CountResponse[] = flatten(yield all(countServices));
  yield call(saveBlogFeedItemsAndCounts, user, blogURL, firebaseItems, fetchedItems, counts, countTypes);
}

function* firebaseBlog(user: firebase.User, blogURL: string) {
  try {
    yield put(feedFirebaseBlogRequest(blogURL));
    const blogData: BlogEntity = yield call(findBlog, user.uid, blogURL);
    yield put(feedFirebaseBlogResponse(blogURL, blogData, user));
    return blogData;
  } catch (e) {
    yield put(feedFetchAndSaveError(blogURL, e));
  }
}

function* firebaseFeed(user: firebase.User, blogURL: string) {
  try {
    yield put(feedFirebaseBlogRequest(blogURL));
    const items: ItemEntity[] = yield call(findAllItems, user.uid, blogURL);
    yield put(feedFirebaseFeedItemsResponse(blogURL, items));
    return items;
  } catch (e) {
    yield put(feedFetchAndSaveError(blogURL, e));
  }
}

function* fetchFeed(blogURL: string, feedURL: string) {
  try {
    yield put(feedFetchRSSRequest(blogURL));
    const feed: FeedResponse = yield call(fetchFeedAction, feedURL);
    yield put(feedFetchRSSResponse(blogURL, feed.items));
    return feed.items;
  } catch (e) {
    yield put(feedFetchRSSError(blogURL, clone(e)));
  }
}

function* saveBlogFeedItemsAndCounts(
  user: firebase.User,
  blogURL: string,
  firebaseItems: ItemEntity[],
  fetchedItems: ItemResponse[],
  counts: CountResponse[],
  countTypes: CountType[]
) {
  try {
    yield put(feedSaveFeedRequest(blogURL, firebaseItems, fetchedItems, counts));
    yield call(saveFeedsAndCounts, user, blogURL, firebaseItems, fetchedItems, counts, countTypes);
    yield put(feedSaveFeedFirebaseResponse(blogURL));
  } catch (e) {
    yield put(feedFirebaseSaveError(blogURL, e));
  }
}
