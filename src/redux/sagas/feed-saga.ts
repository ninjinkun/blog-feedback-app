import { call, put, takeEvery, all, take, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga';
import { findBlog } from '../../models/repositories/blog-repository';
import { findAllItems } from '../../models/repositories/item-repository';
import { fetchFeed as fetchFeedAction } from '../../models/feed-fetcher';
import { ItemResponse, CountResponse } from '../../models/responses';
import { FeedFirebaseBlogResponseAction, feedFetchRSSResponse, feedCrowlerErrorResponse, FeedFetchRSSResponseAction, feedFetchHatenaBookmarkCountsResponse, feedFetchFacebookCountResponse, FeedFetchFacebookCountResponseAction, FeedFetchHatenaBookmarkCountsResponseAction, FeedFirebaseFeedItemsResponseAction, feedSaveFeedFirebaseResponse, FeedFetchFeedAction, feedFirebaseUserResponse, FeedFirebaseUserResponseAction, feedFirebaseBlogResponse, feedFirebaseFeedItemsResponse, feedFirebaseBlogRequest, feedFetchRSSRequest, feedFetchHatenaBookmarkCountsRequest, feedSaveFeedRequest, feedFetchFacebookCountRequest } from '../actions/feed-action';
import { fetchHatenaBookmarkCounts as fetchHatenaBookmarkCountsAction, fetchFacebookCount } from '../../models/count-fetcher';
import { saveFeedsAndCounts } from '../../models/save-count-response';
import { BlogEntity, ItemEntity } from '../../models/entities';
import { fetchFiresbaseUser } from './user-saga';

function* handleFetchAction() {
  while (true) {
    const { blogURL }: FeedFetchFeedAction = yield take('FeedFetchFeedAction');
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
    yield put(feedFirebaseBlogRequest(blogURL));
    const items: ItemEntity[] = yield call(findAllItems, user.uid, blogURL);
    yield put(feedFirebaseFeedItemsResponse(blogURL, items));
  } catch (e) {
    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* fetchFeed(action: FeedFirebaseBlogResponseAction) {
  const { url: blogURL, feedType, feedURL } = action.blogEntity;
  try {
    yield put(feedFetchRSSRequest(blogURL));
    const items: ItemResponse[] = yield call(fetchFeedAction, feedType, feedURL);
    yield put(feedFetchRSSResponse(blogURL, items));
  } catch (e) {
    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* fetchHatenaBookmarkCounts(action: FeedFetchRSSResponseAction) {
  const { blogURL, items } = action;
  try {
    yield put(feedFetchHatenaBookmarkCountsRequest(blogURL));
    const counts: CountResponse[] = yield call(fetchHatenaBookmarkCountsAction, items.map(i => i.url));
    yield put(feedFetchHatenaBookmarkCountsResponse(blogURL, counts))
  } catch (e) {
    yield put(feedFetchHatenaBookmarkCountsResponse(blogURL, []))
    //    yield put(feedCrowlerErrorResponse(blogURL, e));
  }
}

function* fetchFacebookCounts(action: FeedFetchRSSResponseAction) {
  const { blogURL, items } = action;
  try {
    yield put(feedFetchFacebookCountRequest(blogURL));
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
    const { blogURL, items: fetchedItems }: FeedFetchRSSResponseAction = yield take('FeedFetchRSSResponseAction');
    const { counts: hatenaBookmarkCounts }: FeedFetchHatenaBookmarkCountsResponseAction = yield take('FeedFetchHatenaBookmarkCountsResponseAction');
    const { counts: facebookCounts }: FeedFetchFacebookCountResponseAction = yield take('FeedFetchFacebookCountResponseAction');
    const counts: CountResponse[] = [].concat.apply([], [hatenaBookmarkCounts, facebookCounts])
    try {
      yield put(feedSaveFeedRequest(blogURL));
      yield call(saveFeedsAndCounts, user, blogURL, firebaseItems, fetchedItems, counts);
      yield put(feedSaveFeedFirebaseResponse(blogURL));
    } catch (e) {
      yield put(feedCrowlerErrorResponse(blogURL, e));
    }
  }
}

export default function* rootSaga() {
  yield fork(handleFetchAction);
  yield takeEvery('FeedFetchFeedAction', fetchFiresbaseUser);
  yield takeEvery('FeedFirebaseUserResponseAction', firebaseBlog);
  yield takeEvery('FeedFirebaseBlogResponseAction', firebaseFeed);
  yield takeEvery('FeedFirebaseBlogResponseAction', fetchFeed);
  yield takeEvery('FeedFetchRSSResponseAction', fetchHatenaBookmarkCounts);
  yield takeEvery('FeedFetchRSSResponseAction', fetchFacebookCounts);
  yield fork(saveBlogFeedItemsAndCounts);
}
