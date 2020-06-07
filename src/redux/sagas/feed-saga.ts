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
import { fetchCountJsoonCounts } from './feed-sagas/count-jsoon-saga';
import { fetchFacebookCounts } from './feed-sagas/facebook-saga';
import { fetchHatenaBookmarkCounts } from './feed-sagas/hatenabookmark-saga';
import { fetchHatenaStarCounts } from './feed-sagas/hatenastar-saga';
import { fetchPocketCounts } from './feed-sagas/pocket-saga';
import { fetchFiresbaseUser } from './user-saga';
import { feedsSlice } from '../slices/feeds-state';

export default function* feedSaga() {
  yield takeLatest(feedsSlice.actions.startFetchAndSave, handleFetchAction);
}

// main
function* handleFetchAction(action: ReturnType<typeof feedsSlice.actions.startFetchAndSave>) {
  const { blogURL, auth } = action.payload;

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
    yield put(feedsSlice.actions.firebaseBlogRequest(blogURL));
    const blogEntity: BlogEntity = yield call(findBlog, user.uid, blogURL);
    yield put(feedsSlice.actions.firebaseBlogResponse({ blogURL, blogEntity }));
    return blogEntity;
  } catch (error) {
    yield put(feedsSlice.actions.fetchAndSaveError({ blogURL, error }));
  }
}

function* firebaseFeed(user: firebase.User, blogURL: string) {
  try {
    yield put(feedsSlice.actions.firebaseFeedRequest(blogURL));
    const items: ItemEntity[] = yield call(findAllItems, user.uid, blogURL);
    yield put(feedsSlice.actions.firebaseFeedResponse({ blogURL, items }));
    return items;
  } catch (error) {
    yield put(feedsSlice.actions.fetchAndSaveError({ blogURL, error }));
  }
}

function* fetchFeed(blogURL: string, feedURL: string) {
  try {
    yield put(feedsSlice.actions.fetchRSSRequest(blogURL));
    const feed: FeedResponse = yield call(fetchFeedAction, feedURL);
    yield put(feedsSlice.actions.fetchRSSResponse({ blogURL, items: feed.items} ));
    return feed.items;
  } catch (e) {
    yield put(feedsSlice.actions.fetchRSSError({ blogURL, error: clone(e)}));
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
    yield put(feedsSlice.actions.firebaseSaveRequst({ blogURL, firebaseItems, fetchedItems, counts }));
    yield call(saveFeedsAndCounts, user, blogURL, firebaseItems, fetchedItems, counts, countTypes);
    yield put(feedsSlice.actions.firebaseSaveResponse(blogURL));
  } catch (error) {
    yield put(feedsSlice.actions.firebaseSaveError({ blogURL, error }));
  }
}
