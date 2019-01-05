import * as firebase from 'firebase-admin';
import EmailTemplate = require('email-templates');
import { transport } from './mail-transport';
import { fetchFeed } from "./fetchers/feed-fetcher";
import { fetchHatenaBookmarkCounts } from "./fetchers/count-fetchers/hatenabookmark-fetcher";
import { CountType } from './consts/count-type';
import { BlogEntity, ItemEntity, CountEntity } from './entities';
import { db } from './firebase';
import { ItemResponse } from './responses';

type Item = {
  title: string;
  url: string;  
  published: Date;
  counts: Count[];
};

type Count = {
  type: CountType;
  count: number;
  updatedCount: number;
};

export async function crowlAndSendMail(to: string, userId: string, blogId: string) {  
  const blogSnapshot = await db.collection('users').doc(userId).collection('blogs').doc(blogId).get();
  const blogEntity = blogSnapshot.data() as BlogEntity;
  const feed = await fetchFeed(blogEntity.feedURL);
  const itemsSnapshot = await db.collection('users').doc(userId).collection('blogs').doc(blogId).collection('items').get();
  const itemEntities = itemsSnapshot.docs.map(i => i.data()) as ItemEntity[];
  const itemEntitiesMap = new Map(itemEntities.map(i => [i.url, i] as [string, ItemEntity]));

  const urls = feed.items.map(i => i.url);
  const types: CountType[] = [CountType.HatenaBookmark];
  const countMaps: { [key: string]:  Map<string, number> } = {};

  const hatenaBookmarkCounts = await fetchHatenaBookmarkCounts(urls);  
  countMaps[CountType.HatenaBookmark] = new Map(hatenaBookmarkCounts.map(c => [c.url, c.count] as [string, number]));

  const items: Item[] = feed.items.map((itemReponse) => ({ 
    title: itemReponse.title, 
    url: itemReponse.url, 
    published: itemReponse.published,
    counts: types.map(type => createCount(type, itemEntitiesMap.get(itemReponse.url), countMaps[type].get(itemReponse.url))),
  }));
  const shouldSendMail = items.some(i => i.counts.some(c => c.updatedCount > 0));
  if (shouldSendMail) {
    await sendDailyReportMail(to, blogEntity, items);
  }
  return saveYestardayCounts(userId, blogId, items);
}

function createCount(countType: CountType, itemEntitry?: ItemEntity, todayCount?: number): Count {
  const yesterDayCount = itemEntitry && itemEntitry.yesterdayCounts && itemEntitry.yesterdayCounts[countType];
  return { 
    count: todayCount,
    updatedCount: todayCount - (yesterDayCount && yesterDayCount.count || 0),
    type: countType,
  };
}

function saveYestardayCounts(userId: string, blogId: string, items: Item[]) {
  const batch = db.batch();
  for (const item of items) {
    const { url, title, published, counts } = item;
    const itemRef = db.collection('users').doc(userId).collection('blogs').doc(blogId).collection('items').doc(encodeURIComponent(url));
    const yesterdayCounts: { [key: string]: any } = {};
    for (const c of counts) {
      const { type, count } = c;
      if (count > 0) {
        yesterdayCounts[type] = {
          count: count,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        };
      }
    }
    batch.set(itemRef, { 
      title,
      url,
      published,
      yesterdayCounts,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }, {  merge: true });
  }
//  return batch.commit();
}

function sendDailyReportMail(to: string, blog: BlogEntity, items: Item[]) {
  const email = new EmailTemplate({
    message: {
      from: 'report@blog-feedback.app'
    }, 
    transport: { jsonTransport: true },
  });

  return email.send({
    template: 'report',
    message: {
      to,
    },
    locals: {
      blog,
      items,
    },
  });
}
