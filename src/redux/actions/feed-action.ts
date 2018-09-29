import { Dispatch, Action, ActionCreator, bindActionCreators } from 'redux';

import { ItemEntity, CountEntity } from '../../models/entities';
import { CountRepository } from '../../models/repositories';
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

export interface FeedFirebaseCountsResponseAction extends Action {
  type: 'FeedFirebaseCountsResponseAction';
  blogURL: string;
  counts: CountEntity[];
}

export const feedFirebaseCountsResponse: ActionCreator<FeedFirebaseCountsResponseAction> = (blogURL, counts) => ({
  type: 'FeedFirebaseCountsResponseAction',
  blogURL,
  counts,
});

type FeedFirebaseAction = FeedFirebaseRequestAction | FeedFirebaseItemsResponseAction | FeedFirebaseBlogTitleResponseAction | FeedFirebaseCountsResponseAction;

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

      const counts = await (Promise.all(
        [].concat.apply([], [CountType.Facebook, CountType.HatenaBookmark].map(type =>
          itemEntities.map((item) => CountRepository.findLatestCount(uid, blogURL, item.url, type))
        )) as Promise<CountEntity>[]
      ));

      dispatch(feedFirebaseCountsResponse(blogURL, counts.map(i => i)));
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

export type FeedFirebaseActions = FeedFirebaseRequestAction | FeedFirebaseItemsResponseAction | FeedFirebaseBlogTitleResponseAction | FeedFirebaseCountsResponseAction;

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

export const fetchOnlineFeed = (auth: firebase.auth.Auth, blogURL: string) =>
  (dispatch: Dispatch<FeedCrowlerAction>) => {

    const f = async (userId: string) => {
      dispatch(feedCrowlerRequest(blogURL));
      const [fetchBlog, fetchFeed, fetchCount] = crawl(blogURL);
      let blogResponse: BlogResponse | undefined;
      {
        blogResponse = await fetchBlog;
        if (blogResponse) {
          const { url, title, feedUrl, feedType } = blogResponse;
          saveBlog(userId, url, title, feedUrl, feedType);
          dispatch(feedCrowlerTitleResponseAction(blogURL, title));
        }
      }

      {
        const feedItemsResponse = await fetchFeed;
        if (feedItemsResponse) {
          dispatch(feedCrowlerItemsResponse(blogURL, feedItemsResponse));

          const batch = writeBatch();
          feedItemsResponse.forEach((item: ItemResponse) => {
            if (blogResponse) {
              saveItemBatch(
                batch,
                userId,
                blogResponse.url,
                item.url,
                item.title,
                item.published
              );
            }
          });
          batch.commit();
        }
      }

      {
        const countsResponse = await fetchCount;
        if (countsResponse) {
          dispatch(feedCrowlerCountsResponse(blogURL, countsResponse));

          const batch = writeBatch();
          countsResponse.filter((count: CountResponse) => count && count.count > 0).forEach((count: CountResponse) => {
            if (blogResponse) {
              CountRepository.saveCountBatch(batch, userId, blogResponse.url, count.url, count.type, count.count);
            }
          });
          batch.commit();
        }
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

type FeedCrowlerAction = FeedCrowlerRequestAction | FeedBlogURLClearAction | FeedCrowlerTitleResponseAction | FeedCrowlerItemsResponseAction | FeedCrowlerCountsResponseAction;

export type FeedActions = FeedBlogURLChangeAction | FeedFirebaseAction | FeedCrowlerAction;