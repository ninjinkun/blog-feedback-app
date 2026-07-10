import {
  CollectionReference,
  DocumentReference,
  FieldValue,
  WriteBatch,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';

import { ItemEntity } from '../entities';
import { serverTimestamp, writeBatch } from './app-repository';
import { blogRef } from './blog-repository';

function itemsRef(userId: string, blogUrl: string): CollectionReference {
  return collection(blogRef(userId, blogUrl), 'items');
}

export function itemRef(userId: string, blogUrl: string, itemUrl: string): DocumentReference {
  return doc(itemsRef(userId, blogUrl), encodeURIComponent(itemUrl));
}

export async function findAllItems(userId: string, blogUrl: string): Promise<ItemEntity[]> {
  const snapshot = await getDocs(query(itemsRef(userId, blogUrl), orderBy('published', 'desc')));
  return snapshot.docs
    .map((i) => i.data())
    .filter((i) => !!i)
    .map((i): ItemEntity => {
      const { title, url, published, counts, prevCounts } = i;
      return { title, url, published, counts, prevCounts };
    });
}

export type CountSaveEntity = {
  count: number;
  timestamp: FieldValue;
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
  return setDoc(itemRef(userId, blogUrl, url), {
    title,
    url,
    published,
    counts,
    prevCounts,
    timestamp: serverTimestamp(),
  });
}

export function saveItemBatch(
  batch: WriteBatch,
  userId: string,
  blogUrl: string,
  url: string,
  title: string,
  published: Date,
  counts: CountSaveEntities,
  prevCounts: CountSaveEntities
): WriteBatch {
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
  const snapshots = await getDocs(itemsRef(userId, blogUrl));
  const docs = snapshots.docs;
  const promsies: Array<Promise<void>> = [];
  for (let i = 0; i <= docs.length; i += batchSize) {
    const batch = writeBatch();
    const slicedDocs = docs.slice(i, i + batchSize);
    slicedDocs.forEach((d) => batch.delete(d.ref));
    promsies.push(batch.commit());
  }
  return Promise.all(promsies);
}
