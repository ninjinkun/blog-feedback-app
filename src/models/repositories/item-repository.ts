import { firestore } from 'firebase/app';
import { blogRef } from './blog-repository';
import { ItemEntity } from '../entities';

export function itemRef(userId: string, blogUrl: string, itemUrl: string): firebase.firestore.DocumentReference {
  return blogRef(userId, blogUrl).collection('items').doc(encodeURIComponent(itemUrl));
}

export async function findAllItems(userId: string, blogUrl: string): Promise<ItemEntity[]> {
  const snapshot = await blogRef(userId, blogUrl).collection('items').orderBy('published', 'desc').get();
  const items = snapshot.docs
    .map((i: firebase.firestore.DocumentSnapshot) => i.data())
    .filter(i => i !== undefined) as firebase.firestore.DocumentData[];
  return items.map((i: firebase.firestore.DocumentData): ItemEntity => {
    const { title, url, published } = i;
    return {
      title,
      url,
      published,
    } as ItemEntity;
  });
}

export function saveItemBatch(batch: firebase.firestore.WriteBatch, userId: string, blogUrl: string, url: string, title: string, published: Date) {
  batch.set(itemRef(userId, blogUrl, url), {
    title,
    url,
    published,
    timestamp: firestore.FieldValue.serverTimestamp()
  });
}

export function saveItem(userId: string, blogUrl: string, url: string, title: string, published: Date): Promise<void> {
  return itemRef(userId, blogUrl, url).set({
    title,
    url,
    published,
    timestamp: firestore.FieldValue.serverTimestamp()
  });
}
