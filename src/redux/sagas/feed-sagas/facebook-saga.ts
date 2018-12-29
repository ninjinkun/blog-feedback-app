import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import { delay } from 'redux-saga';
import { all, call, put } from 'redux-saga/effects';
import { fetchFacebookCount } from '../../../models/fetchers/count-fetcher';
import { CountResponse } from '../../../models/responses';
import {
  feedFetchFacebookCountError,
  feedFetchFacebookCountRequest,
  feedFetchFacebookCountResponse,
} from '../../actions/feed-actions/facebook-action';

export function* fetchFacebookCounts(blogURL: string, urls: string[], maxFetchCount: number = 20) {
  try {
    yield put(feedFetchFacebookCountRequest(blogURL));
    const slicedURLs = urls.slice(0, maxFetchCount - 1);
    const chunkedURLs = chunk(slicedURLs, 4);
    const counts: CountResponse[][] = [];
    for (const urls of chunkedURLs) {
      counts.push(yield call(fetchFacebookCountChunk, urls));
    }
    const flattenedCounts = flatten(counts);
    yield put(feedFetchFacebookCountResponse(blogURL, flattenedCounts));
    return flattenedCounts;
  } catch (e) {
    yield put(feedFetchFacebookCountError(blogURL, e));
  }
}

export function* fetchFacebookCountChunk(urls: string[], delayMsec: number = 800) {
  const count: CountResponse[] = yield all(urls.map(url => call(fetchFacebookCount, url)));
  yield call(delay, delayMsec);
  return count;
}
