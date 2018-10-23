import * as firebase from 'firebase/app';
import 'firebase/auth';

import { Dispatch, Action, ActionCreator } from 'redux';

import { ItemEntity, CountEntity } from '../../models/entities';
import { fetchUser } from './user-action';
import { CountType } from '../../consts/count-type';
import { findBlog, saveBlog } from '../../models/repositories/blog-repository';
import { findAllItems, saveItemBatch, CountSaveEntities } from '../../models/repositories/item-repository';
import { crawl } from '../../models/crawler';
import { BlogResponse, ItemResponse, CountResponse } from '../../models/responses';
import { writeBatch } from '../../models/repositories/app-repository';

export interface FeedBlogURLChangeAction extends Action {
  type: 'FeedBlogURLChangeAction';
  blogURL: string;
}

export const feedBlogURLChange: ActionCreator<FeedBlogURLChangeAction> = (blogURL) => ({
  type: 'FeedBlogURLChangeAction',
  blogURL,
});

export interface FeedBlogURLClearAction extends Action {
  type: 'FeedBlogURLClearAction';
}

export const feedBlogURLClear: ActionCreator<FeedBlogURLClearAction> = () => ({
  type: 'FeedBlogURLClearAction',
});

export interface FeedFirebaseRequestAction extends Action {
  type: 'FeedFirebaseRequestAction';
  blogURL: string;
}

const feedFirebaseRequest: ActionCreator<FeedFirebaseRequestAction> = (blogURL) => ({
  type: 'FeedFirebaseRequestAction',
  blogURL,
});

export interface FeedFirebaseItemsResponseAction extends Action {
  type: 'FeedFirebaseItemsResponseAction';
  blogURL: string;
  items: ItemEntity[];
}

export const feedFirebaseResponse: ActionCreator<FeedFirebaseItemsResponseAction> = (blogURL, items) => ({
  type: 'FeedFirebaseItemsResponseAction',
  blogURL,
  items,
});

export interface FeedFirebaseBlogTitleResponseAction extends Action {
  type: 'FeedFirebaseBlogTitleResponseAction';
  blogURL: string;
  title: string;
}

export const feedFirebaseBlogTitleResponse: ActionCreator<FeedFirebaseBlogTitleResponseAction> = (blogURL, title) => ({
  type: 'FeedFirebaseBlogTitleResponseAction',
  blogURL,
  title,
});

type FeedFirebaseAction = FeedFirebaseRequestAction | FeedFirebaseItemsResponseAction | FeedFirebaseBlogTitleResponseAction;

export const fetchFirebaseFeed = (auth: firebase.auth.Auth, blogURL: string) =>
  (dispatch: Dispatch<FeedFirebaseActions>) => {
    const f = async (uid: string) => {
      dispatch(feedFirebaseRequest(blogURL));

      const blogData = (await findBlog(uid, blogURL)).data();
      if (blogData) {
        dispatch(feedFirebaseBlogTitleResponse(blogURL, blogData.title));
      }

      const itemEntities = await findAllItems(uid, blogURL);
      dispatch(feedFirebaseResponse(blogURL, itemEntities));
    };

    const currentUser = auth.currentUser;
    if (currentUser) {
      f(currentUser.uid);
    } else {
      fetchUser(auth, (user) => {
        if (user) {
          f(user.uid);
        }
      })(dispatch);
    }
  };

export type FeedFirebaseActions = FeedFirebaseRequestAction | FeedFirebaseItemsResponseAction | FeedFirebaseBlogTitleResponseAction;

export interface FeedCrowlerRequestAction extends Action {
  type: 'FeedCrowlerRequestAction';
  blogURL: string;
}

export const feedCrowlerRequest: ActionCreator<FeedCrowlerRequestAction> = (blogURL) => ({
  type: 'FeedCrowlerRequestAction',
  blogURL,
});

export interface FeedCrowlerTitleResponseAction extends Action {
  type: 'FeedCrowlerTitleResponseAction';
  blogURL: string;
  title: string;
}

export const feedCrowlerTitleResponseAction: ActionCreator<FeedCrowlerTitleResponseAction> = (blogURL, title) => ({
  type: 'FeedCrowlerTitleResponseAction',
  blogURL,
  title,
});

export interface FeedCrowlerItemsResponseAction extends Action {
  type: 'FeedCrowlerItemsResponseAction';
  blogURL: string;
  items: ItemResponse[];
}

export const feedCrowlerItemsResponse: ActionCreator<FeedCrowlerItemsResponseAction> = (blogURL, items) => ({
  type: 'FeedCrowlerItemsResponseAction',
  blogURL,
  items,
});

export interface FeedCrowlerCountsResponseAction extends Action {
  type: 'FeedCrowlerCountsResponseAction';
  blogURL: string;
  counts: CountResponse[];
}

export const feedCrowlerCountsResponse = (blogURL: string, counts: CountResponse[]) => ({
  type: 'FeedCrowlerCountsResponseAction',
  blogURL,
  counts,
});

export interface FeedCrowlerErrorAction extends Action {
  type: 'FeedCrowlerErrorAction';
  blogURL: string;
  error: Error;
}

export const feedCrowlerErrorResponse = (blogURL: string, error: Error) => ({
  type: 'FeedCrowlerErrorAction',
  blogURL,
  error,
});

export type ItemEntitiesFunction = () => ItemEntity[];

export const fetchOnlineFeed = (auth: firebase.auth.Auth, blogURL: string, getFirebaseEntities: ItemEntitiesFunction) =>
  (dispatch: Dispatch<FeedCrowlerAction>) => {

    const f = async (userId: string) => {
      dispatch(feedCrowlerRequest(blogURL));
      const [fetchBlog, fetchFeed, fetchCount] = crawl(blogURL);
      let blogResponse: BlogResponse | undefined;
      try {
        blogResponse = await fetchBlog;
        if (blogResponse) {
          const { url, title, feedURL, feedType } = blogResponse;
          saveBlog(userId, url, title, feedURL, feedType);
          dispatch(feedCrowlerTitleResponseAction(blogURL, title));
        }
      } catch (e) {
        dispatch(feedCrowlerErrorResponse(blogURL, e));
      }

      let feedItemsResponse: ItemResponse[] | undefined;
      try {
        feedItemsResponse = await fetchFeed;
        if (feedItemsResponse) {
          dispatch(feedCrowlerItemsResponse(blogURL, feedItemsResponse));
        }
      } catch (e) {
        dispatch(feedCrowlerErrorResponse(blogURL, e));
      }

      try {
        const countsResponse = await fetchCount;
        if (countsResponse) {
          dispatch(feedCrowlerCountsResponse(blogURL, countsResponse));

          const batch = writeBatch();
          const counts = countsResponse.filter((count: CountResponse) => count && count.count > 0);
          const facebookMap = new Map<string, CountResponse>(counts.filter(c => c.type === CountType.Facebook).map(c => [c.url, c] as [string, CountResponse]));
          const hatenaBookmarkMap = new Map<string, CountResponse>(counts.filter(c => c.type === CountType.HatenaBookmark).map(c => [c.url, c] as [string, CountResponse]));

          const firebaseEntities = getFirebaseEntities();
          const firebaseMap = new Map<string, ItemEntity>(firebaseEntities.map(i => [i.url, i] as [string, ItemEntity]));
          const firebaseFacebookMap = new Map<string, CountEntity>(firebaseEntities.filter(e => e.counts && e.counts[CountType.Facebook]).map(e => [e.url, e.counts && e.counts[CountType.Facebook]] as [string, CountEntity]));
          const firebaseHatenaBookmarkMap = new Map<string, CountEntity>(firebaseEntities.filter(e => e.counts && e.counts[CountType.HatenaBookmark]).map(e => [e.url, e.counts && e.counts[CountType.HatenaBookmark]] as [string, CountEntity]));
          const firebasePrevFacebookMap = new Map<string, CountEntity>(firebaseEntities.filter(e => e.counts && e.prevCounts[CountType.Facebook]).map(e => [e.url, e.counts && e.prevCounts[CountType.Facebook]] as [string, CountEntity]));
          const firebasePrevHatenaBookmarkMap = new Map<string, CountEntity>(firebaseEntities.filter(e => e.counts && e.prevCounts[CountType.HatenaBookmark]).map(e => [e.url, e.counts && e.prevCounts[CountType.HatenaBookmark]] as [string, CountEntity]));

          if (blogResponse && feedItemsResponse) {
            let shouldCommit = false;
            for (let item of feedItemsResponse) {
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
                  timestamp: firebase.firestore.FieldValue.serverTimestamp()
                };
              } else if (firebaseHatenaBookmarkCount) {
                itemCounts.hatenabookmark = firebaseHatenaBookmarkCount;
              }

              const prevCounts: CountSaveEntities = {};
              const prevFacebookCount = firebasePrevFacebookMap.get(item.url);
              if (firebaseFacebookCount && firebaseFacebookCount.timestamp.seconds < (firebase.firestore.Timestamp.now().seconds - 60 * 10)) {
                prevCounts.facebook = firebaseFacebookCount;
              } else if (prevFacebookCount) {
                prevCounts.facebook = prevFacebookCount;
              } else if (!prevFacebookCount && itemCounts.facebook) {
                prevCounts.facebook = itemCounts.facebook;
              }

              const prevHatenaBookmarkCount = firebasePrevHatenaBookmarkMap.get(item.url);
              if (firebaseHatenaBookmarkCount && firebaseHatenaBookmarkCount.timestamp.seconds < (firebase.firestore.Timestamp.now().seconds - 60 * 10)) {
                prevCounts.hatenabookmark = firebaseHatenaBookmarkCount;
              } else if (prevHatenaBookmarkCount) {
                prevCounts.hatenabookmark = prevHatenaBookmarkCount;
              } else if (!prevHatenaBookmarkCount && itemCounts.hatenabookmark) {
                prevCounts.hatenabookmark = itemCounts.hatenabookmark;
              }

              const firebaseItem = firebaseMap.get(item.url);

              const isTitleChanged = !firebaseItem || firebaseItem && item.title !== firebaseItem.title;
              const isHatenaBookmarkCountChanged = !firebaseHatenaBookmarkCount || hatenaBookmarkCount && firebaseHatenaBookmarkCount &&
                hatenaBookmarkCount.count !== firebaseHatenaBookmarkCount.count;
              const isFacebookCountChanged = !firebaseFacebookCount || facebookCount && firebaseFacebookCount &&
                facebookCount.count !== firebaseFacebookCount.count;

              const firebasePrevHatenaBookmarkCount = firebasePrevHatenaBookmarkMap.get(item.url);
              const isPrevHatenaBookmarkCountChanged = !firebaseHatenaBookmarkCount ||
                prevHatenaBookmarkCount && firebasePrevHatenaBookmarkCount && prevHatenaBookmarkCount.count !== firebasePrevHatenaBookmarkCount.count;
              const firebasePrevFacebookCount = firebasePrevFacebookMap.get(item.url);
              const isPrevFacebookCountChanged = !firebaseFacebookCount ||
                prevFacebookCount && firebasePrevFacebookCount && prevFacebookCount.count !== firebasePrevFacebookCount.count;

              const shouldSave = isTitleChanged || isHatenaBookmarkCountChanged || isFacebookCountChanged || isPrevHatenaBookmarkCountChanged || isPrevFacebookCountChanged;
              if (shouldSave) {
                saveItemBatch(
                  batch,
                  userId,
                  blogURL,
                  item.url,
                  item.title,
                  item.published,
                  itemCounts,
                  prevCounts,
                );
                shouldCommit = true;
              }
            }
            if (shouldCommit) {
              await batch.commit();
            }
          }
        }
      } catch (e) {
        dispatch(feedCrowlerErrorResponse(blogURL, e));
      }
    };

    const currentUser = auth.currentUser;
    if (currentUser) {
      f(currentUser.uid);
    } else {
      fetchUser(auth, (user) => {
        if (user) {
          f(user.uid);
        }
      })(dispatch);
    }
  };

type FeedCrowlerAction = FeedCrowlerRequestAction | FeedBlogURLClearAction | FeedCrowlerTitleResponseAction | FeedCrowlerItemsResponseAction | FeedCrowlerCountsResponseAction | FeedCrowlerErrorAction;

export type FeedActions = FeedBlogURLChangeAction | FeedFirebaseAction | FeedCrowlerAction;