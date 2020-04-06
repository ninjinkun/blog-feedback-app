import { firestore } from 'firebase/app';
import { BlogEntity } from './../entities';
import { serverTimestamp } from './app-repository';
import { userRef } from './user-repository';

export async function findAllBlogs(userId: string): Promise<BlogEntity[]> {
  const snapshot = await userRef(userId).collection('blogs').get();

  const items = snapshot.docs
    .map((i: firestore.DocumentSnapshot) => i.data())
    .filter((i) => i !== undefined) as firestore.DocumentData[];

  return items as BlogEntity[];
}

export function blogRef(userId: string, blogUrl: string): firestore.DocumentReference {
  return userRef(userId).collection('blogs').doc(encodeURIComponent(blogUrl));
}

export async function findBlog(userId: string, blogUrl: string): Promise<BlogEntity> {
  const snapshot = await blogRef(userId, blogUrl).get();
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
  return blogRef(userId, blogURL).set({
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
  return blogRef(userId, blogURL).set(
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
  return blogRef(userId, blogURL).delete();
}
