import * as functions from 'firebase-functions';
import { fetchText } from './fetcher';
import { sendWelcomeMail as sendWelcomeMailAction } from './send-welcome-mail';
import { crowlAndSendMail } from './send-daily-report-mail';
import { db } from './firebase';
import { auth, firestore } from 'firebase-admin';
import { flatten } from 'lodash';

export const crossOriginFetch = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  if (!(context.auth && context.auth.uid)) {
    throw new Error('Authorization Error');
  }
  const { url } = data;
  const res = await fetchText(url);
  return { body: res };
});

export const sendWelcomeMail = functions.region('asia-northeast1').auth.user().onCreate(async (user, context) => {
  if (!(context.auth && context.auth.uid)) {
    throw new Error('Authorization Error');
  }
  await sendWelcomeMailAction(user.email);
  return true;
});

export const sendReportMail = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  const users = await auth().listUsers(1000);
  const blogSnapshots = await Promise.all(users.users.map(async user => {
    return [user.uid, user.email, await db
      .collection('users')
      .doc(user.uid)
      .collection('blogs').get()] as [string, string, firestore.QuerySnapshot];
  }));

  const uidBlogIds = flatten(blogSnapshots.map(([uid, email, blogSnapshot]) => {
    const blogIds = blogSnapshot.docs.map(blog => blog.id)
    return blogIds.map(blogId => [uid, email, blogId]) as [string, string, string][];
  }));
  for (const [uid, email, blogId] of uidBlogIds) {
    await crowlAndSendMail(email, uid, blogId);
  }
}); 
//.where('sendReport', '==', true)