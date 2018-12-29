import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import { delay } from 'redux-saga';
import { all, call, put } from 'redux-saga/effects';
import { fetchCountJsoonCount as fetchCountJsoonCountActoun } from '../../../models/fetchers/count-fetchers/count-jsoon-fetcher';
import { CountResponse } from '../../../models/responses';
import {
  feedFetchCountJsoonCountError,
  feedFetchCountJsoonCountRequest,
  feedFetchCountJsoonCountResponse,
} from '../../actions/feed-actions/count-jsoon-action';

export function* fetchCountJsoonCounts(blogURL: string, urls: string[], maxFetchCount: number = 30) {
  try {
    yield put(feedFetchCountJsoonCountRequest(blogURL));
    const slicedURLs = urls.slice(0, maxFetchCount - 1);
    const chunkedURLs = chunk(slicedURLs, 10);
    const counts: CountResponse[][] = [];
    for (const urls of chunkedURLs) {
      counts.push(yield call(fetchCountJsoonCount, urls));
    }
    const flattenedCounts = flatten(counts);
    yield put(feedFetchCountJsoonCountResponse(blogURL, flattenedCounts));
    return flattenedCounts;
  } catch (e) {
    yield put(feedFetchCountJsoonCountError(blogURL, e));
  }
}

function* fetchCountJsoonCount(urls: string[], delayMsec: number = 100) {
  const count: CountResponse[] = yield all(urls.map(url => call(fetchCountJsoonCountActoun, url)));
  yield call(delay, delayMsec);
  return count;
}
