import { Dispatch, Action, ActionCreator, bindActionCreators } from 'redux';

import { ItemEntity, CountEntity, CountsMap } from '../../models/entities';
import { fetchUser } from './user-action';
import { CountType } from '../../consts/count-type';
import { findBlog, saveBlog } from '../../models/repositories/blog-repository';
import { findAllItems, saveItemBatch } from '../../models/repositories/item-repository';
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

export const feedCrowlerCountsResponse: ActionCreator<FeedCrowlerCountsResponseAction> = (blogURL, counts) => ({
  type: 'FeedCrowlerCountsResponseAction',
  blogURL,
  counts,
});

export interface FeedCrowlerErrorAction extends Action {
  type: 'FeedCrowlerErrorAction';
  blogURL: string;
}

export const feedCrowlerErrorResponse: ActionCreator<FeedCrowlerErrorAction> = (blogURL) => ({
  type: 'FeedCrowlerErrorAction',
  blogURL,
});

export const fetchOnlineFeed = (auth: firebase.auth.Auth, blogURL: string) =>
  (dispatch: Dispatch<FeedCrowlerAction>) => {

    const f = async (userId: string) => {
      dispatch(feedCrowlerRequest(blogURL));
      const [fetchBlog, fetchFeed, fetchCount] = crawl(blogURL);
      let blogResponse: BlogResponse | undefined;
      try {
        blogResponse = await fetchBlog;
        if (blogResponse) {
          const { url, title, feedUrl, feedType } = blogResponse;
          saveBlog(userId, url, title, feedUrl, feedType);
          dispatch(feedCrowlerTitleResponseAction(blogURL, title));
        }
      } catch (e) {
        dispatch(feedCrowlerErrorResponse(blogURL));
      }

      let feedItemsResponse: ItemResponse[] | undefined;
      try {
        feedItemsResponse = await fetchFeed;
        if (feedItemsResponse) {
          dispatch(feedCrowlerItemsResponse(blogURL, feedItemsResponse));
        }
      } catch (e) {
        dispatch(feedCrowlerErrorResponse(blogURL));
      }

      try {
        const countsResponse = await fetchCount;
        if (countsResponse) {
          dispatch(feedCrowlerCountsResponse(blogURL, countsResponse));

          const batch = writeBatch();
          const counts = countsResponse.filter((count: CountResponse) => count && count.count > 0);
          const facebookMap = new Map<string, CountResponse>(counts.filter(c => c.type === CountType.Facebook).map(c => [c.url, c] as [string, CountResponse]));
          const hatenaBookmarkMap = new Map<string, CountResponse>(counts.filter(c => c.type === CountType.HatenaBookmark).map(c => [c.url, c] as [string, CountResponse]));

          if (blogResponse && feedItemsResponse) {            
            feedItemsResponse.forEach((item: ItemResponse) => {
              const itemCounts: CountsMap = {};
              const facebookCount = facebookMap.get(item.url);
              if (facebookCount) {
                itemCounts[CountType.Facebook] = { count: facebookCount.count, created: new Date() };
              }
              const hatenaBookmarkCount = hatenaBookmarkMap.get(item.url);
              if (hatenaBookmarkCount) {
                itemCounts[CountType.HatenaBookmark] = { count: hatenaBookmarkCount.count, created: new Date() };
              }
              if (blogResponse) {
                saveItemBatch(
                  batch,
                  userId,
                  blogResponse.url,
                  item.url,
                  item.title,
                  item.published,
                  itemCounts,
                );
              }
            });
            batch.commit();
          }
        }
      } catch (e) {
        dispatch(feedCrowlerErrorResponse(blogURL));
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