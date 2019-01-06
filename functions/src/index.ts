import * as functions from 'firebase-functions';
import { flatten } from 'lodash';
import { auth, firestore } from 'firebase-admin';

import { fetchText } from './fetcher';
import { sendWelcomeMail as sendWelcomeMailAction } from './send-welcome-mail';
import { crowlAndSendMail } from './send-daily-report-mail';
import { db } from './firebase';
import { pubsub } from './pubsub';

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
  console.log('mail sent')
  return true;
});

export const sendReportMailTest = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  const users = await auth().listUsers(1000);
  const blogSnapshots = await Promise.all(users.users.map(async user => {
    return [user.uid, user.email, await db
      .collection('users')
      .doc(user.uid)
      .collection('blogs')
      .where('sendReport', '==', true)
      .get()] as [string, string, firestore.QuerySnapshot];
  }));

  const uidBlogIds = flatten(blogSnapshots.map(([uid, email, blogSnapshot]) => {
    const blogIds = blogSnapshot.docs.map(blog => blog.id)
    return blogIds.map(blogId => [uid, email, blogId]) as [string, string, string][];
  }));
  const topic = pubsub.topic('send-report-mail');
  const publisher = topic.publisher();

  for (const [uid, email, blogId] of uidBlogIds) {
    const message = {
      email,
      uid,
      blogId,
    };
    await publisher.publish(Buffer.from(JSON.stringify(message)));
    console.warn(`${email}, ${uid}, ${blogId}`);
  }
});

export const sendReportMail = functions.region('asia-northeast1').pubsub.topic('send-report-mail').onPublish(async (message) => {
  const { email, uid, blogId } = message.json;
  await crowlAndSendMail(email, uid, blogId);
  console.log('mail sent');
  return true;
});
