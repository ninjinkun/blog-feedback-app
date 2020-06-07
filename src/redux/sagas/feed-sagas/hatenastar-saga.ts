import { call, put } from 'redux-saga/effects';
import { fetchHatenaStarCounts as fetchHatenaStarCountsAction } from '../../../models/fetchers/count-fetchers/hatenastar-fetcher';
import { CountResponse } from '../../../models/responses';
import { feedsSlice } from '../../slices/feeds';

export function* fetchHatenaStarCounts(blogURL: string, urls: string[], maxFetchCount: number = 50) {
  try {
    yield put(feedsSlice.actions.fetchHatenaStarCountRequest(blogURL));
    const slicedURLs = urls.slice(0, maxFetchCount - 1);
    const counts: CountResponse[] = yield call(fetchHatenaStarCountsAction, slicedURLs);
    yield put(feedsSlice.actions.fetchHatenaStarCountResponse({ blogURL, counts }));
    return counts;
  } catch (error) {
    yield put(feedsSlice.actions.fetchHatenaStarCountError({ blogURL, error }));
  }
}
