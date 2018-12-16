import firebase from 'firebase/app';
import 'firebase/firestore';

import { CountType } from '../consts/count-type';
import { CountEntity, ItemEntity } from './entities';
import { serverTimestamp, writeBatch } from './repositories/app-repository';
import { CountSaveEntities, saveItemBatch } from './repositories/item-repository';
import { CountResponse, ItemResponse } from './responses';

// TODO: refactor!!

export async function saveFeedsAndCounts(
  user: firebase.User,
  blogURL: string,
  firebaseEntities: ItemEntity[],
  feedItemsResponse: ItemResponse[],
  countsResponse: CountResponse[]
): Promise<void> {
  const batch = writeBatch();
  const saveEntities = createSaveEntities(firebaseEntities, feedItemsResponse, countsResponse);
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
  countsResponse: CountResponse[]
): ItemSaveEntity[] {
  const counts = countsResponse.filter((count: CountResponse) => count && count.count > 0);
  const facebookMap = new Map<string, CountResponse>(
    counts.filter(c => c.type === CountType.Facebook).map(c => [c.url, c] as [string, CountResponse])
  );
  const hatenaBookmarkMap = new Map<string, CountResponse>(
    counts.filter(c => c.type === CountType.HatenaBookmark).map(c => [c.url, c] as [string, CountResponse])
  );

  const firebaseMap = new Map<string, ItemEntity>(firebaseEntities.map(i => [i.url, i] as [string, ItemEntity]));

  const result: ItemSaveEntity[] = [];

  for (const item of feedItemsResponse) {
    const itemCounts: CountSaveEntities = {};
    const firebaseItem = firebaseMap.get(item.url);

    const createItemCount = (fetchedCount: CountResponse | undefined, firebaseCount: CountEntity | undefined) => {
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
    };

    const facebookCount = facebookMap.get(item.url);
    const firebaseFacebookCount = firebaseItem && firebaseItem.counts[CountType.Facebook];
    itemCounts.facebook = createItemCount(facebookCount, firebaseFacebookCount);
    if (!itemCounts.facebook) {
      delete itemCounts.facebook;
    }

    const hatenaBookmarkCount = hatenaBookmarkMap.get(item.url);
    const firebaseHatenaBookmarkCount = firebaseItem && firebaseItem.counts[CountType.HatenaBookmark];
    itemCounts.hatenabookmark = createItemCount(hatenaBookmarkCount, firebaseHatenaBookmarkCount);
    if (!itemCounts.hatenabookmark) {
      delete itemCounts.hatenabookmark;
    }

    const createPrevItemCount = (
      prevCount: CountEntity | undefined,
      firebaseCount: CountEntity | undefined,
      newCount: any
    ) => {
      const isExistSavedPrevCount = !!prevCount;
      const is10MunitesLaterUntilLastUpdate =
        firebaseCount && firebaseCount.timestamp.seconds < firebase.firestore.Timestamp.now().seconds - 60 * 10;
      if (is10MunitesLaterUntilLastUpdate) {
        // move current count to prevCount
        return firebaseCount;
      } else if (isExistSavedPrevCount) {
        // insert same prevCount last inserted
        return prevCount;
      } else if (!isExistSavedPrevCount && newCount) {
        return newCount;
      }
    };

    const prevCounts: CountSaveEntities = {};

    const prevFacebookCount = firebaseItem && firebaseItem.prevCounts[CountType.Facebook];
    prevCounts.facebook = createPrevItemCount(prevFacebookCount, firebaseFacebookCount, itemCounts.facebook);
    if (!prevCounts.facebook) {
      delete prevCounts.facebook;
    }

    const prevHatenaBookmarkCount = firebaseItem && firebaseItem.prevCounts[CountType.HatenaBookmark];
    prevCounts.hatenabookmark = createPrevItemCount(
      prevHatenaBookmarkCount,
      firebaseHatenaBookmarkCount,
      itemCounts.hatenabookmark
    );
    if (!prevCounts.hatenabookmark) {
      delete prevCounts.hatenabookmark;
    }

    const isTitleChanged = !firebaseItem || (firebaseItem && item.title !== firebaseItem.title);

    const { hatenabookmark: willSaveHatenaBookmarkCount } = itemCounts;
    const isHatenaBookmarkCountChanged =
      !firebaseHatenaBookmarkCount ||
      (willSaveHatenaBookmarkCount &&
        firebaseHatenaBookmarkCount &&
        willSaveHatenaBookmarkCount.count !== firebaseHatenaBookmarkCount.count);

    const { facebook: willSaveFacebookCount } = itemCounts;
    const isFacebookCountChanged =
      !firebaseFacebookCount ||
      (willSaveFacebookCount && firebaseFacebookCount && willSaveFacebookCount.count !== firebaseFacebookCount.count);

    const { hatenabookmark: willSavePrevHatenaBookmarkCount } = prevCounts;
    const isPrevHatenaBookmarkCountChanged =
      prevHatenaBookmarkCount &&
      willSavePrevHatenaBookmarkCount &&
      prevHatenaBookmarkCount.count !== willSavePrevHatenaBookmarkCount.count;

    const willSaveFacebookPrevCount = prevCounts.facebook;
    const isPrevFacebookCountChanged =
      !firebaseFacebookCount ||
      (prevFacebookCount && willSaveFacebookPrevCount && prevFacebookCount.count !== willSaveFacebookPrevCount.count);

    const shouldSave =
      isTitleChanged ||
      isHatenaBookmarkCountChanged ||
      isFacebookCountChanged ||
      isPrevHatenaBookmarkCountChanged ||
      isPrevFacebookCountChanged;
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

type ItemSaveEntity = {
  url: string;
  title: string;
  published: Date;
  itemCounts: CountSaveEntities;
  prevCounts: CountSaveEntities;
};
