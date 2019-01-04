import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import { fetchText } from './fetcher';
import { sendWelcomeMail as sendWelcomeMailAction } from './send-welcome-mail';
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

export const sendWelcomeMailLocal = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  await sendWelcomeMailAction('ninjinkun@gmail.com');
  return true;
});

export const sendWelcomeMail = functions.region('asia-northeast1').auth.user().onCreate(async (user, context) => {
  await sendWelcomeMailAction(user.email);
  return true;
});
