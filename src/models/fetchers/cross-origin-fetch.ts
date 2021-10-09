import { getApp } from '@firebase/app';
import { getFunctions, httpsCallable } from '@firebase/functions';

type Response = {
  body: string;
};

export const crossOriginFetch = (url: string) =>
  httpsCallable<{ url: string }, Response>(getFunctions(getApp(), 'asia-northeast1'), 'crossOriginFetch');
