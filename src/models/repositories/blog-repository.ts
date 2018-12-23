import firebase from 'firebase/app';
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
  blogURL: string,
  blogTitle: string,
  feedURL: string,
  feedType: string,
  twitterEnabled: boolean,
  facebookEnabled: boolean,
  hatenaBookmarkEnabled: boolean,
  hatenaStarEnabled: boolean
): Promise<void> {
  return blogRef(userId, blogURL).set({
    title: blogTitle,
    url: blogURL,
    feedURL,
    feedType,
    timestamp: serverTimestamp(),
    services: {
      twitter: twitterEnabled,
      facebook: facebookEnabled,
      hatenabookmark: hatenaBookmarkEnabled,
      hatenastar: hatenaStarEnabled,
    },
  });
}

export function saveBlogSetting(
  userId: string,
  blogURL: string,
  twitterEnabled: boolean,
  facebookEnabled: boolean,
  hatenaBookmarkEnabled: boolean,
  hatenaStarEnabled: boolean
) {
  return blogRef(userId, blogURL).set(
    {
      timestamp: serverTimestamp(),
      services: {
        twitter: twitterEnabled,
        facebook: facebookEnabled,
        hatenabookmark: hatenaBookmarkEnabled,
        hatenastar: hatenaStarEnabled,
      },
    },
    { merge: true }
  );
}

export function deleteBlog(userId: string, blogURL: string): Promise<void> {
  return blogRef(userId, blogURL).delete();
}
