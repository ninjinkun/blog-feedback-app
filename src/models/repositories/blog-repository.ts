import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { userRef } from './user-repository';
import { BlogEntity } from './../entities';

export async function findAllBlogs(userId: string): Promise<BlogEntity[]> {
  const snapshot = await userRef(userId).collection('blogs').get();

  const items = snapshot.docs
    .map((i: firebase.firestore.DocumentSnapshot) => i.data())
    .filter(i => i !== undefined) as firebase.firestore.DocumentData[];
  
  return items.map(
    ({ title, url, feedURL }): BlogEntity => ({ title, url, feedURL })
  );
}

export function blogRef(userId: string, blogUrl: string): firebase.firestore.DocumentReference {
  return userRef(userId).collection('blogs').doc(encodeURIComponent(blogUrl));
}

export function findBlog(userId: string, blogUrl: string): Promise<firebase.firestore.DocumentSnapshot> {
  return blogRef(userId, blogUrl).get();
}

export function saveBlog(userId: string, blogUrl: string, blogTitle: string, feedURL: string, feedType: string): Promise<void> {
  return blogRef(userId, blogUrl).set({
    title: blogTitle,
    url: blogUrl,
    feedURL,
    feedType,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}