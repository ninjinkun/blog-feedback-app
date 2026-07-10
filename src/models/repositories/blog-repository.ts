import {
  CollectionReference,
  DocumentReference,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';

import { BlogEntity } from './../entities';
import { serverTimestamp } from './app-repository';
import { userRef } from './user-repository';

function blogsRef(userId: string): CollectionReference {
  return collection(userRef(userId), 'blogs');
}

export async function findAllBlogs(userId: string): Promise<BlogEntity[]> {
  const snapshot = await getDocs(blogsRef(userId));

  return snapshot.docs.map((i) => i.data()).filter((i) => i !== undefined) as BlogEntity[];
}

export function blogRef(userId: string, blogUrl: string): DocumentReference {
  return doc(blogsRef(userId), encodeURIComponent(blogUrl));
}

export async function findBlog(userId: string, blogUrl: string): Promise<BlogEntity> {
  const snapshot = await getDoc(blogRef(userId, blogUrl));
  const entity = snapshot.data() as BlogEntity;
  const needsServicesBackwardCompat = !entity.services;
  if (needsServicesBackwardCompat) {
    entity.services = {
      twitter: true,
      countjsoon: false,
      facebook: true,
      hatenabookmark: true,
      hatenastar: true,
      pocket: true,
    };
  }
  if (entity.services && entity.services.pocket === undefined) {
    entity.services.pocket = true;
  }
  return entity;
}

export function saveBlog(
  userId: string,
  blogURL: string,
  blogTitle: string,
  feedURL: string,
  feedType: string,
  reportEnabled: boolean,
  twitterEnabled: boolean,
  countJsonnEnabled: boolean,
  facebookEnabled: boolean,
  hatenaBookmarkEnabled: boolean,
  hatenaStarEnabled: boolean,
  pocketEnabled: boolean
): Promise<void> {
  return setDoc(blogRef(userId, blogURL), {
    title: blogTitle,
    url: blogURL,
    feedURL,
    feedType,
    timestamp: serverTimestamp(),
    sendReport: reportEnabled,
    services: {
      twitter: twitterEnabled,
      countjsoon: countJsonnEnabled,
      facebook: facebookEnabled,
      hatenabookmark: hatenaBookmarkEnabled,
      hatenastar: hatenaStarEnabled,
      pocket: pocketEnabled,
    },
  });
}

export function saveBlogSetting(
  userId: string,
  blogURL: string,
  reportEnabled: boolean,
  twitterEnabled: boolean,
  countJsonnEnabled: boolean,
  facebookEnabled: boolean,
  hatenaBookmarkEnabled: boolean,
  hatenaStarEnabled: boolean,
  pocketEnabled: boolean
) {
  return setDoc(
    blogRef(userId, blogURL),
    {
      timestamp: serverTimestamp(),
      sendReport: reportEnabled,
      services: {
        twitter: twitterEnabled,
        countjsoon: countJsonnEnabled,
        facebook: facebookEnabled,
        hatenabookmark: hatenaBookmarkEnabled,
        hatenastar: hatenaStarEnabled,
        pocket: pocketEnabled,
      },
    },
    { merge: true }
  );
}

export function deleteBlog(userId: string, blogURL: string): Promise<void> {
  return deleteDoc(blogRef(userId, blogURL));
}
