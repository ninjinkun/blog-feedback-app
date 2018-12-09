import * as functions from 'firebase-functions';
import { fetch } from './fetcher';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const crossOriginFetch = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  const uid = context.auth.uid;
  if (!uid) {
    throw new Error('Authorization Error');
  }
  const blogURL = data.url;
  const res = await fetch(blogURL);
  return { body: res };
});
