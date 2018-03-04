import firebase from 'firebase'
import { BlogEntiry, ItemEntity, CountEntity } from './entities'

export class Repository {
    get db() {
      return firebase.firestore();
    }
  }
  
  export class UserRepository {
    userRef({ userId }) {
      return new Repository().db.collection('users').doc(userId)
    }
  }
  
  export class BlogRepository {
    blogRef({ userId, blogUrl }) {
      return new UserRepository().userRef({ userId }).collection('blogs').doc(encodeURIComponent(blogUrl));
    }
  
    getBlog({ userId, blogUrl }) {
      return this.blogRef({ userId, blogUrl }).get();
    }
  
    setBlog({ userId, blogUrl, blogTitle, feedUrl, feedType }) {
      return this.blogRef({ userId, blogUrl }).set({
        title: blogTitle,
        url: blogUrl,
        feedUrl: feedUrl,
        feedType: feedType,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  }
  
  export class ItemRepository {
    itemRef({ userId, blogUrl, itemUrl } ) {
      return new BlogRepository().blogRef({ userId, blogUrl }).collection('items').doc(encodeURIComponent(itemUrl));
    }
  
    async getItems({ userId, blogUrl }) {
      const snapshot = await new BlogRepository().blogRef({ userId, blogUrl }).collection('items').orderBy('published', 'desc').get();
      return snapshot.docs.map(i => i.data()).map(i => 
        new ItemEntity({ 
          title: i.title, 
          url: i.url, 
          published: i.published
        })
      );
    }
  
    setItemBatch({ batch, userId, blogUrl, itemUrl, itemTitle, published}) {
      batch.set(this.itemRef({ userId, blogUrl, itemUrl }), {
        title: itemTitle,
        url: itemUrl,
        published: published,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  
    setItem({ userId, blogUrl, itemUrl, itemTitle, published }) {
      return this.itemRef({ userId, blogUrl, itemUrl }).set({
        title: itemTitle,
        url: itemUrl,
        published: published,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  }
  
  export class CountRepository {
    countRef({ userId, blogUrl, itemUrl, countType }) {
      return new ItemRepository().itemRef({ userId, blogUrl, itemUrl }).collection(countType + '_counts');
    }
  
    async getLatestCount({ userId, blogUrl, itemUrl, countType }) {
      const snapshot = await this.countRef({ userId, blogUrl, itemUrl, countType })
        .orderBy('timestamp', 'desc').limit(1).get()
  
      if (snapshot.docs.length <= 0) return;
      const data = snapshot.docs[0].data();
      return new CountEntity({ url: itemUrl, count: data.count, type: countType });
    }

    addCountBatch({ batch, userId, blogUrl, itemUrl, countType, count }) {
      return batch.set(this.countRef({ userId, blogUrl, itemUrl, countType }).doc(), {
        count: count,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  
    addCount({ userId, blogUrl, itemUrl, countType, count }) {
      return this.countRef({ userId, blogUrl, itemUrl, countType }).add({
        count: count,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  }
  