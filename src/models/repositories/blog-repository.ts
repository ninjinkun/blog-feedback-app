import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { BlogEntity } from './../entities';
import { serverTimestamp } from './app-repository';
import { userRef } from './user-repository';

export async function findAllBlogs(userId: string): Promise<BlogEntity[]> {
  const snapshot = await userRef(userId)
    .collection('blogs')
    .get();

  const items = snapshot.docs
    .map((i: firebase.firestore.DocumentSnapshot) => i.data())
    .filter(i => i !== undefined) as firebase.firestore.DocumentData[];

  return items as BlogEntity[];
}

export function blogRef(userId: string, blogUrl: string): firebase.firestore.DocumentReference {
  return userRef(userId)
    .collection('blogs')
    .doc(encodeURIComponent(blogUrl));
}

export async function findBlog(userId: string, blogUrl: string): Promise<BlogEntity> {
  const snapshot = await blogRef(userId, blogUrl).get();
  return snapshot.data() as BlogEntity;
}

export function saveBlog(
  userId: string,
  blogUrl: string,
  blogTitle: string,
  feedURL: string,
  feedType: string
): Promise<void> {
  return blogRef(userId, blogUrl).set({
    title: blogTitle,
    url: blogUrl,
    feedURL,
    feedType,
    timestamp: serverTimestamp(),
  });
}

export function deleteBlog(userId: string, blogURL: string): Promise<void> {
  return blogRef(userId, blogURL).delete();
}
