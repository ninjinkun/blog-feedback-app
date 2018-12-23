import firebase from 'firebase/app';
import 'firebase/firestore';
import { CountEntities, CountEntity, ItemEntity } from '../entities';
import { serverTimestamp, writeBatch } from './app-repository';
import { blogRef } from './blog-repository';

export function itemRef(userId: string, blogUrl: string, itemUrl: string): firebase.firestore.DocumentReference {
  return blogRef(userId, blogUrl)
    .collection('items')
    .doc(encodeURIComponent(itemUrl));
}

export async function findAllItems(userId: string, blogUrl: string): Promise<ItemEntity[]> {
  const snapshot = await blogRef(userId, blogUrl)
    .collection('items')
    .orderBy('published', 'desc')
    .get();
  const items = snapshot.docs
    .map((i: firebase.firestore.DocumentSnapshot) => i.data())
    .filter(i => i) as firebase.firestore.DocumentData[];
  return items.map(
    (i: firebase.firestore.DocumentData): ItemEntity => {
      const { title, url, published, counts, prevCounts } = i;
      return { title, url, published, counts, prevCounts };
    }
  );
}

export type CountSaveEntity = {
  count: number;
  timestamp: firebase.firestore.FieldValue;
};

export type CountSaveEntities = {
  [key: string]: CountSaveEntity | undefined;
};

export function saveItem(
  userId: string,
  blogUrl: string,
  url: string,
  title: string,
  published: Date,
  counts: CountSaveEntities,
  prevCounts: CountSaveEntities
) {
  return itemRef(userId, blogUrl, url).set({
    title,
    url,
    published,
    counts,
    prevCounts,
    timestamp: serverTimestamp(),
  });
}

export function saveItemBatch(
  batch: firebase.firestore.WriteBatch,
  userId: string,
  blogUrl: string,
  url: string,
  title: string,
  published: Date,
  counts: CountSaveEntities,
  prevCounts: CountSaveEntities
): firebase.firestore.WriteBatch {
  return batch.set(itemRef(userId, blogUrl, url), {
    title,
    url,
    published,
    counts,
    prevCounts,
    timestamp: serverTimestamp(),
  });
}

export async function deleteItemsBatch(userId: string, blogUrl: string, batchSize: number = 50): Promise<void[]> {
  const snapshots = await blogRef(userId, blogUrl)
    .collection('items')
    .get();
  const docs = snapshots.docs;
  const promsies: Array<Promise<void>> = [];
  for (let i = 0; i <= docs.length; i += batchSize) {
    const batch = writeBatch();
    const slicedDocs = docs.slice(i, i + batchSize);
    slicedDocs.forEach(d => batch.delete(d.ref));
    promsies.push(batch.commit());
  }
  return Promise.all(promsies);
}
