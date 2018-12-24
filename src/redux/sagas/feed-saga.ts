import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import { delay } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { CountType } from '../../consts/count-type';
import { BlogEntity, ItemEntity } from '../../models/entities';
import {
  fetchFacebookCount,
  fetchHatenaBookmarkCounts as fetchHatenaBookmarkCountsAction,
  fetchHatenaStarCounts as fetchHatenaStarCountsAction,
} from '../../models/fetchers/count-fetcher';
import { fetchFeed as fetchFeedAction } from '../../models/fetchers/feed-fetcher';
import { findBlog } from '../../models/repositories/blog-repository';
import { findAllItems } from '../../models/repositories/item-repository';
import { CountResponse, FeedResponse, ItemResponse } from '../../models/responses';
import { saveFeedsAndCounts } from '../../models/save-count-response';
import {
  feedCrowlerErrorResponse,
  feedFetchFacebookCountRequest,
  feedFetchFacebookCountResponse,
  FeedFetchFeedAction,
  feedFetchHatenaBookmarkCountsRequest,
  feedFetchHatenaBookmarkCountsResponse,
  feedFetchHatenaStarCountsRequest,
  feedFetchHatenaStarCountsResponse,
  feedFetchRSSRequest,
  feedFetchRSSResponse,
  feedFirebaseBlogRequest,
  feedFirebaseBlogResponse,
  feedFirebaseFeedItemsResponse,
  feedSaveFeedFirebaseResponse,
  feedSaveFeedRequest,
} from '../actions/feed-action';
import { fetchFiresbaseUser } from './user-saga';

export default function* feedSaga() {
  yield takeLatest('FeedFetchFeedAction', handleFetchAction);
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

  const urls = fetchedItems.map(i => i.url);
  const countServices = [];
  if (services && services.hatenabookmark) {
    countServices.push(call(fetchHatenaBookmarkCounts, blogURL, urls));
  }
  if (services && services.hatenastar) {
    countServices.push(call(fetchHatenaStarCounts, blogURL, urls));
  }
  if (services && services.facebook) {
    countServices.push(call(fetchFacebookCounts, blogURL, urls));
  }
  const counts: CountResponse[] = flatten(yield all(countServices));
  const countTypes: CountType[] = [];
  const needsBackwordCompat = !services;
  if ((services && services.hatenabookmark) || needsBackwordCompat) {
    countTypes.push(CountType.HatenaBookmark);
  }
  if (services && services.hatenastar) {
    countTypes.push(CountType.HatenaStar);
  }
  if ((services && services.facebook) || needsBackwordCompat) {
    countTypes.push(CountType.Facebook);
  }
  yield call(saveBlogFeedItemsAndCounts, user, blogURL, firebaseItems, fetchedItems, counts, countTypes);
}

function* firebaseBlog(user: firebase.User, blogURL: string) {
  try {
    yield put(feedFirebaseBlogRequest(blogURL));
    const blogData: BlogEntity = yield call(findBlog, user.uid, blogURL);
    yield put(feedFirebaseBlogResponse(blogURL, blogData, user));
    return blogData;
  } catch (e) {
    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* firebaseFeed(user: firebase.User, blogURL: string) {
  try {
    yield put(feedFirebaseBlogRequest(blogURL));
    const items: ItemEntity[] = yield call(findAllItems, user.uid, blogURL);
    yield put(feedFirebaseFeedItemsResponse(blogURL, items));
    return items;
  } catch (e) {
    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* fetchFeed(blogURL: string, feedURL: string) {
  try {
    yield put(feedFetchRSSRequest(blogURL));
    const feed: FeedResponse = yield call(fetchFeedAction, feedURL);
    yield put(feedFetchRSSResponse(blogURL, feed.items));
    return feed.items;
  } catch (e) {
    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* fetchHatenaBookmarkCounts(blogURL: string, urls: string[], maxFetchCount: number = 50) {
  try {
    yield put(feedFetchHatenaBookmarkCountsRequest(blogURL));
    const slicedURLs = urls.slice(0, maxFetchCount - 1);
    const counts: CountResponse[] = yield call(fetchHatenaBookmarkCountsAction, slicedURLs);
    yield put(feedFetchHatenaBookmarkCountsResponse(blogURL, counts));
    return counts;
  } catch (e) {
    //    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* fetchHatenaStarCounts(blogURL: string, urls: string[], maxFetchCount: number = 50) {
  try {
    yield put(feedFetchHatenaStarCountsRequest(blogURL));
    const slicedURLs = urls.slice(0, maxFetchCount - 1);
    const counts: CountResponse[] = yield call(fetchHatenaStarCountsAction, slicedURLs);
    yield put(feedFetchHatenaStarCountsResponse(blogURL, counts));
    return counts;
  } catch (e) {
    //    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* fetchFacebookCounts(blogURL: string, urls: string[], maxFetchCount: number = 20) {
  try {
    yield put(feedFetchFacebookCountRequest(blogURL));
    const slicedURLs = urls.slice(0, maxFetchCount - 1);
    const chunkedURLs = chunk(slicedURLs, 4);
    const counts: CountResponse[][] = [];
    for (const urls of chunkedURLs) {
      counts.push(yield call(fetchFacebookCountChunk, urls));
    }
    const flattenedCounts = flatten(counts);
    yield put(feedFetchFacebookCountResponse(blogURL, flattenedCounts));
    return flattenedCounts;
  } catch (e) {
    //    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* fetchFacebookCountChunk(urls: string[]) {
  const count: CountResponse[] = yield all(urls.map(url => call(fetchFacebookCount, url)));
  yield call(delay, 800);
  return count;
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
    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}
