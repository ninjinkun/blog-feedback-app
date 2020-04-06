import { ThunkAction } from 'redux-thunk';
import { BlogEntity, ItemEntity } from '../../../models/entities';
import { findBlog } from '../../../models/repositories/blog-repository';
import { AppState } from '../../states/app-state';
import { currenUserOronAuthStateChanged } from '../user-action';

export const FIREBASE_FEED_RESPONSE = 'feed/feed/FIREBASE_RESPONSE' as const;
export function feedFirebaseFeedItemsResponse(blogURL: string, items: ItemEntity[]) {
  return {
    type: FIREBASE_FEED_RESPONSE,
    blogURL,
    items,
  };
}

export const FIREBASE_BLOG_REQUEST = 'feed/blog/FIREBASE_REQUEST' as const;
export function feedFirebaseBlogRequest(blogURL: string) {
  return {
    type: FIREBASE_BLOG_REQUEST,
    blogURL,
  };
}

export const FIREBASE_BLOG_RESPONSE = 'feed/blog/FIREBASE_RESPONSE' as const;
export function feedFirebaseBlogResponse(blogURL: string, blogEntity: BlogEntity, user: firebase.User) {
  return {
    type: FIREBASE_BLOG_RESPONSE,
    blogURL,
    blogEntity,
    user,
  };
}

export const FIREBASE_BLOG_ERROR = 'feed/blog/FIREBASE_ERROR' as const;
export function feedFirebaseBlogError(blogURL: string, error: Error) {
  return {
    type: FIREBASE_BLOG_ERROR,
    blogURL,
    error,
  };
}

export type FeedFirebaseActions =
  | ReturnType<typeof feedFirebaseBlogRequest>
  | ReturnType<typeof feedFirebaseBlogResponse>
  | ReturnType<typeof feedFirebaseBlogError>
  | ReturnType<typeof feedFirebaseFeedItemsResponse>;

type TA = ThunkAction<void, AppState, undefined, FeedFirebaseActions>;
export function fetchFirebaseBlog(auth: firebase.auth.Auth, blogURL: string): TA {
  return async (dispatch) => {
    let user;
    try {
      user = await currenUserOronAuthStateChanged(auth);
    } catch (e) {
      throw e;
    }
    try {
      dispatch(feedFirebaseBlogRequest(blogURL));
      const blog = await findBlog(user.uid, blogURL);
      dispatch(feedFirebaseBlogResponse(blogURL, blog, user));
    } catch (e) {
      dispatch(feedFirebaseBlogError(blogURL, e));
    }
  };
}
