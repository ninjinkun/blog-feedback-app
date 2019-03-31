import { firestore, User } from 'firebase/app';

import { CountType } from './consts/count-type';
import { CountEntity, ItemEntity, Services } from './entities';
import { serverTimestamp, writeBatch } from './repositories/app-repository';
import { CountSaveEntities, saveItemBatch } from './repositories/item-repository';
import { CountResponse, ItemResponse } from './responses';

// TODO: refactor!!

export async function saveFeedsAndCounts(
  user: User,
  blogURL: string,
  firebaseEntities: ItemEntity[],
  feedItemsResponse: ItemResponse[],
  countsResponse: CountResponse[],
  countTypes: CountType[] = [CountType.Facebook, CountType.HatenaBookmark]
): Promise<void> {
  const batch = writeBatch();
  const saveEntities = createSaveEntities(firebaseEntities, feedItemsResponse, countsResponse, countTypes);
  for (const item of saveEntities) {
    saveItemBatch(batch, user.uid, blogURL, item.url, item.title, item.published, item.itemCounts, item.prevCounts);
  }
  if (saveEntities.length) {
    return batch.commit();
  } else {
    return;
  }
}

export function createSaveEntities(
  firebaseEntities: ItemEntity[],
  feedItemsResponse: ItemResponse[],
  countsResponse: CountResponse[],
  countTypes: CountType[] = [CountType.Facebook, CountType.HatenaBookmark]
): ItemSaveEntity[] {
  const counts = countsResponse.filter((count: CountResponse) => count && count.count > 0);
  const countTypeMaps: { [key: string]: Map<string, CountResponse> } = {};
  for (const countType of countTypes) {
    countTypeMaps[countType] = new Map(
      counts.filter(count => count.type === countType).map(c => [c.url, c] as [string, CountResponse])
    );
  }

  const firebaseMap = new Map<string, ItemEntity>(firebaseEntities.map(i => [i.url, i] as [string, ItemEntity]));

  const result: ItemSaveEntity[] = [];

  for (const item of feedItemsResponse) {
    const itemCounts: CountSaveEntities = {};
    const prevCounts: CountSaveEntities = {};
    const firebaseItem = firebaseMap.get(item.url);
    const isTitleChanged = !firebaseItem || (firebaseItem && item.title !== firebaseItem.title);
    let shouldSave = isTitleChanged;

    for (const countType of countTypes) {
      const typeMap = countTypeMaps[countType];

      const typeCount = typeMap.get(item.url);
      const firebaseTypeCount = firebaseItem && firebaseItem.counts && firebaseItem.counts[countType];
      itemCounts[countType] = createItemCount(typeCount, firebaseTypeCount);
      if (!itemCounts[countType]) {
        delete itemCounts[countType];
      }

      const prevTypeCount = firebaseItem && firebaseItem.prevCounts && firebaseItem.prevCounts[countType];
      prevCounts[countType] = createPrevItemCount(prevTypeCount, firebaseTypeCount, itemCounts[countType]);
      if (!prevCounts[countType]) {
        delete prevCounts[countType];
      }

      const willSaveTypeCount = itemCounts[countType];
      const isTypeCountChanged =
        !firebaseTypeCount ||
        !!(willSaveTypeCount && firebaseTypeCount && willSaveTypeCount.count !== firebaseTypeCount.count);

      const willSavePrevTypeCount = prevCounts[countType];
      const isPrevTypeCountChanged = !!(
        prevTypeCount &&
        willSavePrevTypeCount &&
        prevTypeCount.count !== willSavePrevTypeCount.count
      );

      shouldSave = shouldSave || isTypeCountChanged || isPrevTypeCountChanged;
    }

    if (shouldSave) {
      result.push({
        url: item.url,
        title: item.title,
        published: item.published,
        itemCounts,
        prevCounts,
      });
    }
  }
  return result;
}

function createItemCount(fetchedCount: CountResponse | undefined, firebaseCount: CountEntity | undefined) {
  const isNewCount = fetchedCount && !firebaseCount;
  const isUpdatedCount = fetchedCount && firebaseCount && fetchedCount.count > firebaseCount.count;
  if ((isNewCount || isUpdatedCount) && fetchedCount) {
    return {
      count: fetchedCount.count,
      timestamp: serverTimestamp(),
    };
  } else {
    return firebaseCount;
  }
}

function createPrevItemCount(
  prevCount: CountEntity | undefined,
  firebaseCount: CountEntity | undefined,
  newCount: any
) {
  const isExistSavedPrevCount = !!prevCount;
  const is10MunitesLaterUntilLastUpdate =
    firebaseCount && firebaseCount.timestamp.seconds < firestore.Timestamp.now().seconds - 60 * 10;
  if (is10MunitesLaterUntilLastUpdate) {
    // move current count to prevCount
    return firebaseCount;
  } else if (isExistSavedPrevCount) {
    // insert same prevCount last inserted
    return prevCount;
  } else if (!isExistSavedPrevCount && newCount) {
    return newCount;
  }
}

type ItemSaveEntity = {
  url: string;
  title: string;
  published: Date;
  itemCounts: CountSaveEntities;
  prevCounts: CountSaveEntities;
};
