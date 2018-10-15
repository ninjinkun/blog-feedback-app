import { firestore } from 'firebase/app';
import { blogRef } from './blog-repository';
import { ItemEntity, CountEntities, CountEntity } from '../entities';

export function itemRef(userId: string, blogUrl: string, itemUrl: string): firebase.firestore.DocumentReference {
  return blogRef(userId, blogUrl).collection('items').doc(encodeURIComponent(itemUrl));
}

export async function findAllItems(userId: string, blogUrl: string): Promise<ItemEntity[]> {
  const snapshot = await blogRef(userId, blogUrl).collection('items').orderBy('published', 'desc').get();
  const items = snapshot.docs
    .map((i: firebase.firestore.DocumentSnapshot) => i.data())
    .filter(i => i) as firebase.firestore.DocumentData[];
  return items.map((i: firebase.firestore.DocumentData): ItemEntity => {
    const { title, url, published, counts, prevCounts } = i;
    return {　title, url, published: published, counts, prevCounts } as ItemEntity;
  });
}

export type CountSaveEntity = CountEntity | {
  count: number,
  timestamp: firebase.firestore.FieldValue,
};

export type CountSaveEntities = CountEntities | {
  hatenabookmark?: CountSaveEntity,
  facebook?: CountSaveEntity,
};

export function saveItemBatch(
    batch: firebase.firestore.WriteBatch, 
    userId: string, 
    blogUrl: string, 
    url: string, 
    title: string, 
    published: Date, 
    counts: CountSaveEntities,
    prevCounts: CountSaveEntities,
  ): firebase.firestore.WriteBatch {

  return batch.set(itemRef(userId, blogUrl, url), {
    title,
    url,
    published,
    counts,
    prevCounts,
    timestamp: firestore.FieldValue.serverTimestamp()
  });
}
