import { getApp } from '@firebase/app';
import { getFunctions, httpsCallable, HttpsCallableResult } from '@firebase/functions';

type Response = {
  body: string;
};

export function crossOriginFetch(url: string): Promise<HttpsCallableResult<Response>> {
  const crossOriginFetch = httpsCallable<{ url: string }, Response>(
    getFunctions(getApp(), 'asia-northeast1'),
    'crossOriginFetch'
  );
  return crossOriginFetch({ url });
}
