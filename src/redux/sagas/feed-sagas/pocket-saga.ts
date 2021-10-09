import { chunk, flatten } from 'lodash';
import { all, call, delay, put } from 'redux-saga/effects';
import { fetchPocketCount } from '../../../models/fetchers/count-fetchers/pocket-fetcher';
import { CountResponse } from '../../../models/responses';
import { feedsSlice } from '../../slices/feeds';

export function* fetchPocketCounts(blogURL: string, urls: string[], maxFetchCount: number = 30) {
  try {
    yield put(feedsSlice.actions.fetchPocketCountRequest(blogURL));
    const slicedURLs = urls.slice(0, maxFetchCount - 1);
    const chunkedURLs = chunk(slicedURLs, 10);
    const counts: CountResponse[][] = [];
    for (const urls of chunkedURLs) {
      counts.push(yield call(fetchPocketCountChunk, urls));
    }
    const flattenedCounts = flatten(counts);
    yield put(feedsSlice.actions.fetchPocketCountResponse({ blogURL, counts: flattenedCounts }));
    return flattenedCounts;
  } catch (error) {
    if (error instanceof Error) {
      yield put(feedsSlice.actions.fetchPocketCountError({ blogURL, error }));
    }
  }
}

function* fetchPocketCountChunk(urls: string[], delayMsec: number = 100) {
  const count: CountResponse[] = yield all(urls.map((url) => call(fetchPocketCount, url)));
  yield delay(delayMsec);
  return count;
}
