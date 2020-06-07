import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import { all, call, delay, put } from 'redux-saga/effects';
import { fetchFacebookCount } from '../../../models/fetchers/count-fetchers/facebook-fetcher';
import { CountResponse } from '../../../models/responses';
import { feedsSlice } from '../../slices/feeds-state';

export function* fetchFacebookCounts(blogURL: string, urls: string[], maxFetchCount: number = 20) {
  try {
    yield put(feedsSlice.actions.fetchFacebookCountsRequest(blogURL));
    const slicedURLs = urls.slice(0, maxFetchCount - 1);
    const chunkedURLs = chunk(slicedURLs, 4);
    const counts: CountResponse[][] = [];
    for (const urls of chunkedURLs) {
      counts.push(yield call(fetchFacebookCountChunk, urls));
    }
    const flattenedCounts = flatten(counts);
    yield put(feedsSlice.actions.fetchFacebookCountResponse({ blogURL, counts: flattenedCounts }));
    return flattenedCounts;
  } catch (error) {
    yield put(feedsSlice.actions.fetchFacebookCountError({ blogURL, error }));
  }
}

export function* fetchFacebookCountChunk(urls: string[], delayMsec: number = 800) {
  const count: CountResponse[] = yield all(urls.map((url) => call(fetchFacebookCount, url)));
  yield delay(delayMsec);
  return count;
}
