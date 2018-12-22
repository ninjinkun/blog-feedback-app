import * as functions from 'firebase-functions';
import { fetchText } from './fetcher';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const crossOriginFetch = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  if (!(context.auth && context.auth.uid)) {
    throw new Error('Authorization Error');
  }
  const { url } = data;
  const res = await fetchText(url);
  return { body: res };
});
