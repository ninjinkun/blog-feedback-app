import flatten from 'lodash/flatten';
import { delay } from 'redux-saga';
import { all, call, fork, put, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { BlogEntity, ItemEntity } from '../../models/entities';
import {
  fetchFacebookCount,
  fetchHatenaBookmarkCounts as fetchHatenaBookmarkCountsAction,
} from '../../models/fetchers/count-fetcher';
import { fetchFeed as fetchFeedAction } from '../../models/fetchers/feed-fetcher';
import { findBlog } from '../../models/repositories/blog-repository';
import { findAllItems } from '../../models/repositories/item-repository';
import { CountResponse, ItemResponse } from '../../models/responses';
import { saveFeedsAndCounts } from '../../models/save-count-response';
import {
  feedCrowlerErrorResponse,
  feedFetchFacebookCountRequest,
  feedFetchFacebookCountResponse,
  FeedFetchFacebookCountResponseAction,
  FeedFetchFeedAction,
  feedFetchHatenaBookmarkCountsRequest,
  feedFetchHatenaBookmarkCountsResponse,
  FeedFetchHatenaBookmarkCountsResponseAction,
  feedFetchRSSRequest,
  feedFetchRSSResponse,
  FeedFetchRSSResponseAction,
  feedFirebaseBlogRequest,
  feedFirebaseBlogResponse,
  FeedFirebaseBlogResponseAction,
  feedFirebaseFeedItemsResponse,
  FeedFirebaseFeedItemsResponseAction,
  feedFirebaseUserResponse,
  FeedFirebaseUserResponseAction,
  feedSaveFeedFirebaseResponse,
  feedSaveFeedRequest,
} from '../actions/feed-action';
import { fetchFiresbaseUser } from './user-saga';

export default function* rootSaga() {
  yield takeLatest('FeedFetchFeedAction', handleFetchAction);
}

// main
function* handleFetchAction(action: FeedFetchFeedAction) {
  const { blogURL, auth } = action;

  const user: firebase.User = yield call(fetchFiresbaseUser, auth);

  const blogEntity: BlogEntity = yield call(firebaseBlog, user, blogURL);

  const [firebaseItems, fetchedItems]: [ItemEntity[], ItemResponse[]] = yield all([
    call(firebaseFeed, user, blogURL),
    call(fetchFeed, blogURL, blogEntity.feedURL),
  ]);

  const urls = fetchedItems.map(i => i.url);
  const [hatenaBookmarkCounts, facebookCounts]: [CountResponse[], CountResponse[]] = yield all([
    call(fetchHatenaBookmarkCounts, blogURL, urls),
    call(fetchFacebookCounts, blogURL, urls),
  ]);

  const counts: CountResponse[] = flatten([hatenaBookmarkCounts, facebookCounts]);

  yield call(saveBlogFeedItemsAndCounts, user, blogURL, firebaseItems, fetchedItems, counts);
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
    const items: ItemResponse[] = yield call(fetchFeedAction, feedURL);
    yield put(feedFetchRSSResponse(blogURL, items));
    return items;
  } catch (e) {
    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* fetchHatenaBookmarkCounts(blogURL: string, urls: string[]) {
  try {
    yield put(feedFetchHatenaBookmarkCountsRequest(blogURL));
    const counts: CountResponse[] = yield call(fetchHatenaBookmarkCountsAction, urls);
    yield put(feedFetchHatenaBookmarkCountsResponse(blogURL, counts));
    return counts;
  } catch (e) {
    //    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* fetchFacebookCounts(blogURL: string, urls: string[]) {
  try {
    yield put(feedFetchFacebookCountRequest(blogURL));
    const counts: CountResponse[] = yield all(
      urls.map(url => {
        call(delay, 100);
        return call(fetchFacebookCount, url);
      })
    );
    yield put(feedFetchFacebookCountResponse(blogURL, counts));
    return counts;
  } catch (e) {
    //    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* saveBlogFeedItemsAndCounts(
  user: firebase.User,
  blogURL: string,
  firebaseItems: ItemEntity[],
  fetchedItems: ItemResponse[],
  counts: CountResponse[]
) {
  try {
    yield put(feedSaveFeedRequest(blogURL));
    yield call(saveFeedsAndCounts, user, blogURL, firebaseItems, fetchedItems, counts);
    yield put(feedSaveFeedFirebaseResponse(blogURL));
  } catch (e) {
    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}
