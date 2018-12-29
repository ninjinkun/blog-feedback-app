import { call, put } from 'redux-saga/effects';
import { fetchHatenaStarCounts as fetchHatenaStarCountsAction } from '../../../models/fetchers/count-fetcher';
import { CountResponse } from '../../../models/responses';
import {
  feedFetchHatenaStarCountError,
  feedFetchHatenaStarCountsRequest,
  feedFetchHatenaStarCountsResponse,
} from '../../actions/feed-actions/hatenastar-action';

export function* fetchHatenaStarCounts(blogURL: string, urls: string[], maxFetchCount: number = 50) {
  try {
    yield put(feedFetchHatenaStarCountsRequest(blogURL));
    const slicedURLs = urls.slice(0, maxFetchCount - 1);
    const counts: CountResponse[] = yield call(fetchHatenaStarCountsAction, slicedURLs);
    yield put(feedFetchHatenaStarCountsResponse(blogURL, counts));
    return counts;
  } catch (e) {
    yield put(feedFetchHatenaStarCountError(blogURL, e));
  }
}
