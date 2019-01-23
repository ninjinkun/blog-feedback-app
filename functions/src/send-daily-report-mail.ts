import * as firebase from 'firebase-admin';
import EmailTemplate = require('email-templates');
import * as uuidv1 from 'uuid/v1';

import { transport } from './mail-transport';
import { fetchFeed } from "./fetchers/feed-fetcher";
import { fetchHatenaBookmarkCounts } from "./fetchers/count-fetchers/hatenabookmark-fetcher";
import { CountType, toServiceURL } from './consts/count-type';
import { BlogEntity, ItemEntity } from './entities';
import { db } from './firebase';
import { ItemResponse, CountResponse } from './responses';
import { fetchHatenaStarCounts } from './fetchers/count-fetchers/hatenastar-fetcher';
import { fetchCountJsoonCounts } from './fetchers/count-fetchers/count-jsoon-fetcher';
import { fetchFacebookCounts } from './fetchers/count-fetchers/facebook-fetcher';
import { fetchPocketCounts } from './fetchers/count-fetchers/pocket-fetcher';
import { getMailLock, createMailLock } from './repositories/mail-lock-repository';
import { resolve } from 'path';
import { gaImageSrc } from './mail-ga';
import { sum } from 'lodash';

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

export async function crowlAndSendMail(to: string, userId: string, blogURL: string, uuid: string, sendForce = false) {
  const uuidDoc = await getMailLock(uuid);
  if (uuidDoc) {
    return false;
  }
  const taskUUID = uuidv1();
  // defer save wait
  const createMailPromise = createMailLock(uuid, taskUUID);

  const [blogEntity, items] = await crawl(userId, blogURL);
  const updatedCounts = sum(items.map(i => sum(i.counts.map(c => c.updatedCount))));
  const shouldSendMail = updatedCounts > 0;
  if (shouldSendMail || sendForce) {
    await createMailPromise;
    // check twice
    const uuidDocAgain = await getMailLock(uuid);
    if (uuidDocAgain) {
      const { taskUUID: fetchedTaskUUID } = uuidDocAgain;
      if (taskUUID !== fetchedTaskUUID) {
        return false;
      }
    }
    await sendDailyReportMail(to, userId, blogURL, blogEntity.title, items, updatedCounts, sendForce);
    console.log('mail sent');
  }
  await saveYestardayCounts(userId, blogURL, items);
  return true;
}

async function crawl(userId: string, blogURL: string) {
  const blogId = encodeURIComponent(blogURL);
  const blogSnapshot = await db.collection('users').doc(userId).collection('blogs').doc(blogId).get();
  const blogEntity = blogSnapshot.data() as BlogEntity;
  const feed = await fetchFeed(blogEntity.feedURL);
  const itemsSnapshot = await db.collection('users').doc(userId).collection('blogs').doc(blogId).collection('items').get();
  const itemEntities = itemsSnapshot.docs.map(i => i.data()) as ItemEntity[];
  const itemEntitiesMap = new Map(itemEntities.map(i => [i.url, i] as [string, ItemEntity]));

  const urls = feed.items.map(i => i.url);
  const countMaps: { [key: string]: Map<string, number> } = {};
  const countTasks: [CountType, Promise<CountResponse[]>][] = [];
  if (blogEntity.services) {
    if (blogEntity.services.countjsoon) {            
      countTasks.push([CountType.CountJsoon, fetchCountJsoonCounts(urls)]);
    }
    if (blogEntity.services.facebook) {
      countTasks.push([CountType.Facebook, fetchFacebookCounts(urls)]);
    }
    if (blogEntity.services.hatenabookmark) {
      countTasks.push([CountType.HatenaBookmark, fetchHatenaBookmarkCounts(urls)]);
    }
    if (blogEntity.services.hatenastar) {
      countTasks.push([CountType.HatenaStar, fetchHatenaStarCounts(urls)]);
    }
    if (blogEntity.services.pocket) {
      countTasks.push([CountType.Pocket, fetchPocketCounts(urls)]);
    }
  }
  const promises = countTasks.map((([type, task]) => (async () => {
    try {
      const counts = await task;
      countMaps[type] = new Map(counts.map((c) => [c.url, c.count] as [string, number]));
    } catch (e) {
      console.warn(e);
    }
  })()))
  await Promise.all(promises);

  const items: Item[] = feed.items.map((itemResponse) => ({
    title: itemResponse.title,
    url: itemResponse.url,
    published: itemResponse.published,
    counts: countTasks.map(([type, _]) => createCount(type, itemResponse, itemEntitiesMap.get(itemResponse.url), countMaps[type] && countMaps[type].get(itemResponse.url))),
  }));
  return [blogEntity, items] as [BlogEntity, Item[]];  
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

function saveYestardayCounts(userId: string, blogURL: string, items: Item[]) {
  const batch = db.batch();
  for (const item of items) {
    const { url, title, published, counts } = item;
    const itemRef = db.collection('users').doc(userId).collection('blogs').doc(encodeURIComponent(blogURL)).collection('items').doc(encodeURIComponent(url));
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
    if (Object.keys(yesterdayCounts).length) {
      batch.set(itemRef, {
        title,
        url,
        published,
        yesterdayCounts,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    }
  }
  return batch.commit();
}

function sendDailyReportMail(to: string, userId: string, blogURL: string, blogTitle: string, items: Item[], updatedCounts: number, sendForce = false) {
  const email = new EmailTemplate({
    message: {
      from: '"BlogFeedback" <report@blog-feedback.app>'
    },
    transport: transport(),
  });
  const ga = gaImageSrc(userId, 'daily-report', `/mail/report/${encodeURIComponent(blogURL)}`);
  return email.send({
    template: 'report',
    message: {
      to,
    },
    locals: {
      blogTitle,
      blogURL,
      items,
      updatedCounts,
      sendForce,
      ga,
    },
  });
}
