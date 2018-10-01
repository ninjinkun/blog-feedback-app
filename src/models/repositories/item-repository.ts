import { firestore } from 'firebase/app';
import { blogRef } from './blog-repository';
import { ItemEntity, CountsMap } from '../entities';

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
    return {　title, url, published, counts, prevCounts } as ItemEntity;
  });
}

export function saveItemBatch(batch: firebase.firestore.WriteBatch, userId: string, blogUrl: string, url: string, title: string, published: Date, counts: CountsMap) {
  batch.set(itemRef(userId, blogUrl, url), {
    title,
    url,
    published,
    counts,
    timestamp: firestore.FieldValue.serverTimestamp()
  });
}
