import { call, put, takeEvery, takeLatest, all, throttle, take, fork, join } from 'redux-saga/effects'
import { delay } from 'redux-saga';
import { findBlog, saveBlog } from '../../models/repositories/blog-repository';
import { findAllItems, saveItemBatch, CountSaveEntities } from '../../models/repositories/item-repository';
import { crawl, fetchFeed as fetchFeedAction } from '../../models/crawler';
import { BlogResponse, ItemResponse, CountResponse } from '../../models/responses';
import { FeedFirebaseBlogResponseAction, feedCrowlerItemsResponse, feedCrowlerErrorResponse, FeedFetchFeedItemsResponseAction, feedFetchHatenaBookmarkCountsResponse, feedFetchFacebookCountResponse, FeedCrowlerTitleResponseAction, FeedFetchFacebookCountResponseAction, FeedFetchHatenaBookmarkCountsResponseAction, FeedFirebaseFeedItemsResponseAction, feedSaveFeedsResponseAction, FeedFetchFeedAction, feedFirebaseUserResponse, FeedFirebaseUserResponseAction, feedFirebaseBlogResponse, feedFirebaseFeedItemsResponse, feedFirebaseBlogRequest } from '../actions/feed-action';
import { fetchHatenaBookmarkCounts as fetchHatenaBookmarkCountsAction, fetchFacebookCount } from '../../models/count-fetcher';
import { saveFeedsAndCounts } from '../../models/save-count-response';
import { UserFirebaseResponseAction, currenUserOronAuthStateChanged, userFirebaseUserResponse, UserFetchFirebaseUserAction, userFetchFirebaseUser, userFirebaseError } from '../actions/user-action';
import { BlogEntity, ItemEntity } from '../../models/entities';

function* fetchFiresbaseUser(action: UserFetchFirebaseUserAction) {
  const { auth } = action;
  try {
    const user: firebase.User = yield call(currenUserOronAuthStateChanged, auth);
    yield put(userFirebaseUserResponse(user));
  } catch (e) {
    yield put(userFirebaseError(e));
  }
}

function* handleUser() {
  while (true) {
    const { auth, blogURL }: FeedFetchFeedAction = yield take('FeedFetchFeedAction');
    yield put(userFetchFirebaseUser(auth));
    const { user }: FeedFirebaseUserResponseAction = yield take('UserFirebaseResponseAction');
    yield put(feedFirebaseUserResponse(blogURL, user));
  }
}


function* firebaseBlog(action: FeedFirebaseUserResponseAction) {
  const { blogURL, user } = action;
  try {
    yield put(feedFirebaseBlogRequest(blogURL));
    const blogData: BlogEntity = yield call(findBlog, user.uid, blogURL);
    yield put(feedFirebaseBlogResponse(blogURL, blogData, user));
  } catch (e) {
    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* firebaseFeed(action: FeedFirebaseBlogResponseAction) {
  const { blogURL, user } = action;
  try {
    const items: ItemEntity[] = yield call(findAllItems, user.uid, blogURL);
    yield put(feedFirebaseFeedItemsResponse(blogURL, items));
  } catch (e) {
    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}


function* fetchFeed(action: FeedFirebaseBlogResponseAction) {
  const { url, feedType, feedURL } = action.blogEntity;
  try {
    const items: ItemResponse[] = yield call(fetchFeedAction, feedType, feedURL);
    yield put(feedCrowlerItemsResponse(url, items));
  } catch (e) {
    yield put(feedCrowlerErrorResponse(url, e));
  }
}

function* fetchHatenaBookmarkCounts(action: FeedFetchFeedItemsResponseAction) {
  const { blogURL, items } = action;
  try {
    const counts: CountResponse[] = yield call(fetchHatenaBookmarkCountsAction, items.map(i => i.url));
    yield put(feedFetchHatenaBookmarkCountsResponse(blogURL, counts))
  } catch (e) {
    yield put(feedFetchHatenaBookmarkCountsResponse(blogURL, []))
//    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* fetchFacebookCounts(action: FeedFetchFeedItemsResponseAction) {
  const { blogURL, items } = action;
  try {
    const counts: CountResponse[] = yield all(
      items.map(i => {
        call(delay, 100);
        return call(fetchFacebookCount, i.url)
      })
    );
    yield put(feedFetchFacebookCountResponse(blogURL, counts))
  } catch (e) {
    yield put(feedFetchFacebookCountResponse(blogURL, []))
//    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* saveBlogFeedItemsAndCounts() {
  while (true) {
    const { user }: FeedFirebaseUserResponseAction = yield take('FeedFirebaseUserResponseAction');
    const { items: firebaseItems }: FeedFirebaseFeedItemsResponseAction = yield take('FeedFirebaseFeedItemsResponseAction');
    const { blogURL, items: fetchedItems }: FeedFetchFeedItemsResponseAction = yield take('FeedFetchFeedItemsResponseAction');
    const { counts: hatenaBookmarkCounts }: FeedFetchHatenaBookmarkCountsResponseAction = yield take('FeedFetchHatenaBookmarkCountsResponseAction');
    const { counts: facebookCounts }: FeedFetchFacebookCountResponseAction = yield take('FeedFetchFacebookCountResponseAction');
    const counts: CountResponse[] = [].concat.apply([], [hatenaBookmarkCounts, facebookCounts])
    try {
      yield call(saveFeedsAndCounts, user, blogURL, firebaseItems, fetchedItems, counts);
      yield put(feedSaveFeedsResponseAction(blogURL));
    } catch (e) {
      yield put(feedCrowlerErrorResponse(blogURL, e));
    }
  }
}

export default function* rootSaga() {
  yield fork(handleUser);
  yield takeEvery('FeedFetchFeedAction', fetchFiresbaseUser);
  yield takeEvery('FeedFirebaseUserResponseAction', firebaseBlog);
  yield takeEvery('FeedFirebaseBlogResponseAction', firebaseFeed);
  yield takeEvery('FeedFirebaseBlogResponseAction', fetchFeed);  
  yield takeEvery('FeedFetchFeedItemsResponseAction', fetchHatenaBookmarkCounts);
  yield takeEvery('FeedFetchFeedItemsResponseAction', fetchFacebookCounts);
  yield fork(saveBlogFeedItemsAndCounts);
}
