import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { BlogEntity, ItemEntity, CountEntity } from './entities';

export const Repository = {
  get db() {
    return firebase.firestore();
  }
};

export const UserRepository = {
  userRef(userId: string): firebase.firestore.DocumentReference {
    return Repository.db.collection('users').doc(userId);
  }
};

export const BlogRepository = {
  async getBlogs(userId: string): Promise<BlogEntity[]> {
    const snapshot = await UserRepository.userRef(userId).collection('blogs').get();
    const items = snapshot.docs
      .map((i: firebase.firestore.DocumentSnapshot) => i.data())
      .filter(i => i !== undefined) as firebase.firestore.DocumentData[];
    return items.map((i): BlogEntity => {
      return {
        title: i.title,
        url: i.url,
        feedUrl: i.feedUrl,
      } as BlogEntity;
    });
  },

  blogRef(userId: string, blogUrl: string): firebase.firestore.DocumentReference {
    return UserRepository.userRef(userId).collection('blogs').doc(encodeURIComponent(blogUrl));
  },

  getBlog(userId: string, blogUrl: string): Promise<firebase.firestore.DocumentSnapshot> {
    return this.blogRef(userId, blogUrl).get();
  },

  setBlog(userId: string, blogUrl: string, blogTitle: string, feedUrl: string, feedType: string): Promise<void> {
    return this.blogRef(userId, blogUrl).set({
      title: blogTitle,
      url: blogUrl,
      feedUrl: feedUrl,
      feedType: feedType,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
};

export const ItemRepository = {
  itemRef(userId: string, blogUrl: string, itemUrl: string): firebase.firestore.DocumentReference {
    return BlogRepository.blogRef(userId, blogUrl).collection('items').doc(encodeURIComponent(itemUrl));
  },

  async getItems(userId: string, blogUrl: string): Promise<ItemEntity[]> {
    const snapshot = await BlogRepository.blogRef(userId, blogUrl).collection('items').orderBy('published', 'desc').get();
    const items = snapshot.docs
      .map((i: firebase.firestore.DocumentSnapshot) => i.data())
      .filter(i => i !== undefined) as firebase.firestore.DocumentData[];
    return items.map((i: firebase.firestore.DocumentData): ItemEntity => {
      return {
        title: i.title,
        url: i.url,
        published: i.published
      } as ItemEntity;
    });
  },

  setItemBatch(batch: firebase.firestore.WriteBatch, userId: string, blogUrl: string, itemUrl: string, itemTitle: string, published: Date) {
    batch.set(this.itemRef(userId, blogUrl, itemUrl), {
      title: itemTitle,
      url: itemUrl,
      published: published,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  },

  setItem(userId: string, blogUrl: string, itemUrl: string, itemTitle: string, published: Date): Promise<void> {
    return this.itemRef(userId, blogUrl, itemUrl).set({
      title: itemTitle,
      url: itemUrl,
      published: published,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
};

export const CountRepository = {
  countRef(userId: string, blogUrl: string, itemUrl: string, countType: string) {
    return ItemRepository.itemRef(userId, blogUrl, itemUrl).collection(countType + '_counts');
  },

  async getLatestCount(userId: string, blogUrl: string, itemUrl: string, countType: string): Promise<CountEntity | undefined> {
    const snapshot = await this.countRef(userId, blogUrl, itemUrl, countType)
      .orderBy('timestamp', 'desc').limit(1).get();

    if (snapshot.docs.length <= 0) {
      return;
    }
    const data = snapshot.docs[0].data();
    return { url: itemUrl, count: data.count, type: countType } as CountEntity;
  },

  addCountBatch(batch: firebase.firestore.WriteBatch, userId: string, blogUrl: string, itemUrl: string, countType: string, count: number) {
    return batch.set(this.countRef(userId, blogUrl, itemUrl, countType).doc(), {
      count: count,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  },

  addCount(userId: string, blogUrl: string, itemUrl: string, countType: string, count: number) {
    return this.countRef(userId, blogUrl, itemUrl, countType).add({
      count: count,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
};
