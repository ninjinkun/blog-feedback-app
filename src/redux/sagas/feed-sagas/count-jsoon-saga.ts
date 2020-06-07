import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import { all, call, delay, put } from 'redux-saga/effects';
import { fetchCountJsoonCount as fetchCountJsoonCountActoun } from '../../../models/fetchers/count-fetchers/count-jsoon-fetcher';
import { CountResponse } from '../../../models/responses';
import { feedsSlice } from '../../states/feeds-state';

export function* fetchCountJsoonCounts(blogURL: string, urls: string[], maxFetchCount: number = 30) {
  try {
    yield put(feedsSlice.actions.fetchCountJSOONCountRequest(blogURL));
    const slicedURLs = urls.slice(0, maxFetchCount - 1);
    const chunkedURLs = chunk(slicedURLs, 10);
    const counts: CountResponse[][] = [];
    for (const urls of chunkedURLs) {
      counts.push(yield call(fetchCountJsoonCount, urls));
    }
    const flattenedCounts = flatten(counts);
    yield put(feedsSlice.actions.fetchCountJSOONCountResponse({ blogURL, counts: flattenedCounts }));
    return flattenedCounts;
  } catch (error) {
    yield put(feedsSlice.actions.fetchCountJSOONCountError({ blogURL, error }));
  }
}

function* fetchCountJsoonCount(urls: string[], delayMsec: number = 100) {
  const count: CountResponse[] = yield all(urls.map((url) => call(fetchCountJsoonCountActoun, url)));
  yield delay(delayMsec);
  return count;
}
