import * as firebase from 'firebase';
import { BlogEntity, ItemEntity, CountEntity } from './entities';
import { WriteBatch, CollectionReference, DocumentReference, DocumentSnapshot } from '@firebase/firestore-types';

export class Repository {
  get db() {
    return firebase.firestore();
  }
}

export class UserRepository {
  userRef(userId: string): firebase.firestore.DocumentReference {
    return new Repository().db.collection('users').doc(userId);
  }
}

export class BlogRepository {
  blogRef(userId: string, blogUrl: string): firebase.firestore.DocumentReference {
    return new UserRepository().userRef(userId).collection('blogs').doc(encodeURIComponent(blogUrl));
  }

  getBlog(userId: string, blogUrl: string): Promise<firebase.firestore.DocumentSnapshot> {
    return this.blogRef(userId, blogUrl).get();
  }

  setBlog(userId: string, blogUrl: string, blogTitle: string, feedUrl: string, feedType: string): Promise<void> {
    return this.blogRef(userId, blogUrl).set({
      title: blogTitle,
      url: blogUrl,
      feedUrl: feedUrl,
      feedType: feedType,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

export class ItemRepository {
  itemRef(userId: string, blogUrl: string, itemUrl: string): firebase.firestore.DocumentReference {
    return new BlogRepository().blogRef(userId, blogUrl).collection('items').doc(encodeURIComponent(itemUrl));
  }

  async getItems(userId: string, blogUrl: string): Promise<ItemEntity[]> {
    const snapshot = await new BlogRepository().blogRef(userId, blogUrl).collection('items').orderBy('published', 'desc').get();
    return snapshot.docs.map((i: firebase.firestore.DocumentSnapshot) => i.data()).map((i: firebase.firestore.DocumentData | undefined) =>
      new ItemEntity(
        i!.title,
        i!.url,
        i!.published
      )
    );
  }

  setItemBatch(batch: firebase.firestore.WriteBatch, userId: string, blogUrl: string, itemUrl: string, itemTitle: string, published: Date) {
    batch.set(this.itemRef(userId, blogUrl, itemUrl), {
      title: itemTitle,
      url: itemUrl,
      published: published,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  setItem(userId: string, blogUrl: string, itemUrl: string, itemTitle: string, published: Date): Promise<void> {
    return this.itemRef(userId, blogUrl, itemUrl).set({
      title: itemTitle,
      url: itemUrl,
      published: published,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

export class CountRepository {
  countRef(userId: string, blogUrl: string, itemUrl: string, countType: string) {
    return new ItemRepository().itemRef(userId, blogUrl, itemUrl).collection(countType + '_counts');
  }

  async getLatestCount(userId: string, blogUrl: string, itemUrl: string, countType: string): Promise<CountEntity | undefined> {
    const snapshot = await this.countRef(userId, blogUrl, itemUrl, countType)
      .orderBy('timestamp', 'desc').limit(1).get();

    if (snapshot.docs.length <= 0) {
      return;
    }
    const data = snapshot.docs[0].data();
    return new CountEntity(itemUrl, data.count, countType);
  }

  addCountBatch(batch: firebase.firestore.WriteBatch, userId: string, blogUrl: string, itemUrl: string, countType: string, count: number) {
    return batch.set(this.countRef(userId, blogUrl, itemUrl, countType).doc(), {
      count: count,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  addCount(userId: string, blogUrl: string, itemUrl: string, countType: string, count: number) {
    return this.countRef(userId, blogUrl, itemUrl, countType).add({
      count: count,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}
