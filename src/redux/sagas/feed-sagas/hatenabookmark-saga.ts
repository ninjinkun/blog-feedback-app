import { call, put } from 'redux-saga/effects';
import { fetchHatenaBookmarkCounts as fetchHatenaBookmarkCountsAction } from '../../../models/fetchers/count-fetcher';
import { CountResponse } from '../../../models/responses';
import {
  feedFetchHatenaBookmarkCountError,
  feedFetchHatenaBookmarkCountsRequest,
  feedFetchHatenaBookmarkCountsResponse,
} from '../../actions/feed-actions/hatenabookmark-action';

export function* fetchHatenaBookmarkCounts(blogURL: string, urls: string[], maxFetchCount: number = 50) {
  try {
    yield put(feedFetchHatenaBookmarkCountsRequest(blogURL));
    const slicedURLs = urls.slice(0, maxFetchCount - 1);
    const counts: CountResponse[] = yield call(fetchHatenaBookmarkCountsAction, slicedURLs);
    yield put(feedFetchHatenaBookmarkCountsResponse(blogURL, counts));
    return counts;
  } catch (e) {
    yield put(feedFetchHatenaBookmarkCountError(blogURL, e));
  }
}
