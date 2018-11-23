import firebase from 'firebase';
import { CountType } from '../consts/count-type';
import { CountEntity, ItemEntity } from './entities';
import { writeBatch } from './repositories/app-repository';
import { CountSaveEntities, saveItemBatch } from './repositories/item-repository';
import { CountResponse, ItemResponse } from './responses';

export async function saveFeedsAndCounts(
  user: firebase.User,
  blogURL: string,
  firebaseEntities: ItemEntity[],
  feedItemsResponse: ItemResponse[],
  countsResponse: CountResponse[]
): Promise<void> {
  const batch = writeBatch();
  const counts = countsResponse.filter((count: CountResponse) => count && count.count > 0);
  const facebookMap = new Map<string, CountResponse>(
    counts.filter(c => c.type === CountType.Facebook).map(c => [c.url, c] as [string, CountResponse])
  );
  const hatenaBookmarkMap = new Map<string, CountResponse>(
    counts.filter(c => c.type === CountType.HatenaBookmark).map(c => [c.url, c] as [string, CountResponse])
  );

  const firebaseMap = new Map<string, ItemEntity>(firebaseEntities.map(i => [i.url, i] as [string, ItemEntity]));
  const firebaseFacebookMap = new Map<string, CountEntity>(
    firebaseEntities
      .filter(e => e.counts && e.counts[CountType.Facebook])
      .map(e => [e.url, e.counts && e.counts[CountType.Facebook]] as [string, CountEntity])
  );
  const firebaseHatenaBookmarkMap = new Map<string, CountEntity>(
    firebaseEntities
      .filter(e => e.counts && e.counts[CountType.HatenaBookmark])
      .map(e => [e.url, e.counts && e.counts[CountType.HatenaBookmark]] as [string, CountEntity])
  );
  const firebasePrevFacebookMap = new Map<string, CountEntity>(
    firebaseEntities
      .filter(e => e.counts && e.prevCounts[CountType.Facebook])
      .map(e => [e.url, e.counts && e.prevCounts[CountType.Facebook]] as [string, CountEntity])
  );
  const firebasePrevHatenaBookmarkMap = new Map<string, CountEntity>(
    firebaseEntities
      .filter(e => e.counts && e.prevCounts[CountType.HatenaBookmark])
      .map(e => [e.url, e.counts && e.prevCounts[CountType.HatenaBookmark]] as [string, CountEntity])
  );

  let shouldCommit = false;
  for (const item of feedItemsResponse) {
    const itemCounts: CountSaveEntities = {};
    const facebookCount = facebookMap.get(item.url);
    const firebaseFacebookCount = firebaseFacebookMap.get(item.url);
    if (facebookCount) {
      const { count } = facebookCount;
      itemCounts.facebook = {
        count,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
    } else if (firebaseFacebookCount) {
      itemCounts.facebook = firebaseFacebookCount;
    }

    const hatenaBookmarkCount = hatenaBookmarkMap.get(item.url);
    const firebaseHatenaBookmarkCount = firebaseHatenaBookmarkMap.get(item.url);
    if (hatenaBookmarkCount) {
      const { count } = hatenaBookmarkCount;
      itemCounts.hatenabookmark = {
        count,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
    } else if (firebaseHatenaBookmarkCount) {
      itemCounts.hatenabookmark = firebaseHatenaBookmarkCount;
    }

    const prevCounts: CountSaveEntities = {};
    const prevFacebookCount = firebasePrevFacebookMap.get(item.url);
    if (
      firebaseFacebookCount &&
      firebaseFacebookCount.timestamp.seconds < firebase.firestore.Timestamp.now().seconds - 60 * 10
    ) {
      prevCounts.facebook = firebaseFacebookCount;
    } else if (prevFacebookCount) {
      prevCounts.facebook = prevFacebookCount;
    } else if (!prevFacebookCount && itemCounts.facebook) {
      prevCounts.facebook = itemCounts.facebook;
    }

    const prevHatenaBookmarkCount = firebasePrevHatenaBookmarkMap.get(item.url);
    if (
      firebaseHatenaBookmarkCount &&
      firebaseHatenaBookmarkCount.timestamp.seconds < firebase.firestore.Timestamp.now().seconds - 60 * 10
    ) {
      prevCounts.hatenabookmark = firebaseHatenaBookmarkCount;
    } else if (prevHatenaBookmarkCount) {
      prevCounts.hatenabookmark = prevHatenaBookmarkCount;
    } else if (!prevHatenaBookmarkCount && itemCounts.hatenabookmark) {
      prevCounts.hatenabookmark = itemCounts.hatenabookmark;
    }

    const firebaseItem = firebaseMap.get(item.url);

    const isTitleChanged = !firebaseItem || (firebaseItem && item.title !== firebaseItem.title);
    const isHatenaBookmarkCountChanged =
      !firebaseHatenaBookmarkCount ||
      (hatenaBookmarkCount &&
        firebaseHatenaBookmarkCount &&
        hatenaBookmarkCount.count !== firebaseHatenaBookmarkCount.count);
    const isFacebookCountChanged =
      !firebaseFacebookCount ||
      (facebookCount && firebaseFacebookCount && facebookCount.count !== firebaseFacebookCount.count);

    const firebasePrevHatenaBookmarkCount = firebasePrevHatenaBookmarkMap.get(item.url);
    const isPrevHatenaBookmarkCountChanged =
      !firebaseHatenaBookmarkCount ||
      (prevHatenaBookmarkCount &&
        firebasePrevHatenaBookmarkCount &&
        prevHatenaBookmarkCount.count !== firebasePrevHatenaBookmarkCount.count);
    const firebasePrevFacebookCount = firebasePrevFacebookMap.get(item.url);
    const isPrevFacebookCountChanged =
      !firebaseFacebookCount ||
      (prevFacebookCount && firebasePrevFacebookCount && prevFacebookCount.count !== firebasePrevFacebookCount.count);

    const shouldSave =
      isTitleChanged ||
      isHatenaBookmarkCountChanged ||
      isFacebookCountChanged ||
      isPrevHatenaBookmarkCountChanged ||
      isPrevFacebookCountChanged;
    if (shouldSave) {
      saveItemBatch(batch, user.uid, blogURL, item.url, item.title, item.published, itemCounts, prevCounts);
      shouldCommit = true;
    }
  }
  if (shouldCommit) {
    return batch.commit();
  } else {
    return;
  }
}
