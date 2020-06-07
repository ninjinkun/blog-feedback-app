import { call, put } from 'redux-saga/effects';
import { fetchHatenaBookmarkCounts as fetchHatenaBookmarkCountsAction } from '../../../models/fetchers/count-fetchers/hatenabookmark-fetcher';
import { CountResponse } from '../../../models/responses';
import { feedsSlice } from '../../slices/feeds';

export function* fetchHatenaBookmarkCounts(blogURL: string, urls: string[], maxFetchCount: number = 50) {
  try {
    yield put(feedsSlice.actions.fetchHatenaBookmarkCountRequest(blogURL));
    const slicedURLs = urls.slice(0, maxFetchCount - 1);
    const counts: CountResponse[] = yield call(fetchHatenaBookmarkCountsAction, slicedURLs);
    yield put(feedsSlice.actions.fetchHatenaBookmarkCountResponse({ blogURL, counts }));
    return counts;
  } catch (error) {
    yield put(feedsSlice.actions.fetchHatenaBookmarkCountError({ blogURL, error }));
  }
}
