import * as firebase from 'firebase-admin';
import EmailTemplate = require('email-templates');
import { transport } from './mail-transport';
import { fetchFeed } from "./fetchers/feed-fetcher";
import { fetchHatenaBookmarkCounts } from "./fetchers/count-fetchers/hatenabookmark-fetcher";
import { CountType, toServiceURL } from './consts/count-type';
import { BlogEntity, ItemEntity } from './entities';
import { db } from './firebase';
import { ItemResponse } from './responses';
import { fetchHatenaStarCounts } from './fetchers/count-fetchers/hatenastar-fetcher';
import { fetchCountJsoonCounts } from './fetchers/count-fetchers/count-jsoon-fetcher';
import { fetchFacebookCounts } from './fetchers/count-fetchers/facebook-fetcher';
import { fetchPocketCounts } from './fetchers/count-fetchers/pocket-fetcher';

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
  link?: string;
};

export async function crowlAndSendMail(to: string, userId: string, blogId: string) {
  const blogSnapshot = await db.collection('users').doc(userId).collection('blogs').doc(blogId).get();
  const blogEntity = blogSnapshot.data() as BlogEntity;
  const feed = await fetchFeed(blogEntity.feedURL);
  const itemsSnapshot = await db.collection('users').doc(userId).collection('blogs').doc(blogId).collection('items').get();
  const itemEntities = itemsSnapshot.docs.map(i => i.data()) as ItemEntity[];
  const itemEntitiesMap = new Map(itemEntities.map(i => [i.url, i] as [string, ItemEntity]));

  const urls = feed.items.map(i => i.url);
  const types: CountType[] = [];
  const countMaps: { [key: string]: Map<string, number> } = {};
  if (blogEntity.services) {
    if (blogEntity.services.countjsoon) {
      types.push(CountType.CountJsoon);
      try {
        const countJsoonCounts = await fetchCountJsoonCounts(urls);
        countMaps[CountType.CountJsoon] = new Map(countJsoonCounts.map(c => [c.url, c.count] as [string, number]));
      } catch (e) {
        console.error(e);
      }
    }
    if (blogEntity.services.facebook) {
      types.push(CountType.Facebook);
      try {
        const facebookCounts = await fetchFacebookCounts(urls);
        countMaps[CountType.Facebook] = new Map(facebookCounts.map(c => [c.url, c.count] as [string, number]));
      } catch (e) {
        console.error(e);
      }
    }
    if (blogEntity.services.hatenabookmark) {
      types.push(CountType.HatenaBookmark);
      try {
        const hatenaBookmarkCounts = await fetchHatenaBookmarkCounts(urls);
        countMaps[CountType.HatenaBookmark] = new Map(hatenaBookmarkCounts.map(c => [c.url, c.count] as [string, number]));
      } catch (e) {
        console.error(e);
      }
    }
    if (blogEntity.services.hatenastar) {
      types.push(CountType.HatenaStar);
      try {
        const hatenaStarCounts = await fetchHatenaStarCounts(urls);
        countMaps[CountType.HatenaStar] = new Map(hatenaStarCounts.map(c => [c.url, c.count] as [string, number]));
      } catch (e) {
        console.error(e);
      }
    }
    if (blogEntity.services.pocket) {
      types.push(CountType.Pocket);
      try {
        const pocketCounts = await fetchPocketCounts(urls);
        countMaps[CountType.Pocket] = new Map(pocketCounts.map(c => [c.url, c.count] as [string, number]));
      } catch (e) {
        console.error(e);
      }
    }
  }

  const items: Item[] = feed.items.map((itemResponse) => ({
    title: itemResponse.title,
    url: itemResponse.url,
    published: itemResponse.published,
    counts: types.map(type => createCount(type, itemResponse, itemEntitiesMap.get(itemResponse.url), countMaps[type] && countMaps[type].get(itemResponse.url))),
  }));
  const shouldSendMail = items.some(i => i.counts.some(c => c.updatedCount > 0));
  if (shouldSendMail) {
    await sendDailyReportMail(to, blogEntity, items);
  }
  await saveYestardayCounts(userId, blogId, items);
  return true;
}

function createCount(countType: CountType, itemResponse: ItemResponse, itemEntitry?: ItemEntity, todayCount?: number): Count {
  const yesterDayCount = itemEntitry && itemEntitry.yesterdayCounts && itemEntitry.yesterdayCounts[countType];
  const prevCount = itemEntitry && itemEntitry.counts && itemEntitry.counts[countType];
  const link = toServiceURL(countType, itemResponse.url);
  return {
    count: todayCount || prevCount && prevCount.count || 0,
    updatedCount: todayCount - (yesterDayCount && yesterDayCount.count || prevCount && prevCount.count || 0),
    type: countType,
    link,
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
    }, { merge: true });
  }
  return batch.commit();
}

function sendDailyReportMail(to: string, blog: BlogEntity, items: Item[]) {
  const email = new EmailTemplate({
    message: {
      from: '"BlogFeedback" <report@blog-feedback.app>'
    },
    transport: transport(),
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
