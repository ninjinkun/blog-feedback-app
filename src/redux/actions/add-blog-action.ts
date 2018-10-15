import { Dispatch, Action, ActionCreator, bindActionCreators } from 'redux';
import { fetchBlog } from '../../models/feed-fetcher';
import { fetchUser } from './user-action';
import { saveBlog } from '../../models/repositories/blog-repository';

export interface AddBlogRequestAction extends Action {
  type: 'AddBlogRequestAction';
}

const addBlogRequest: ActionCreator<AddBlogRequestAction> = () => ({
  type: 'AddBlogRequestAction',
});

export interface AddBlogResponseAction extends Action {
  type: 'AddBlogResponseAction';
}

export const addBlogResponse: ActionCreator<AddBlogResponseAction> = () => ({
  type: 'AddBlogResponseAction',
});

export type AddBlogActions = AddBlogRequestAction | AddBlogResponseAction;

export const addBlog = (auth: firebase.auth.Auth, blogURL: string) =>
  (dispatch: Dispatch<AddBlogActions>) => {
    dispatch(addBlogRequest());
    const f = async (userId: string) => {
      const blogResponse = await fetchBlog(blogURL);
      if (blogResponse) {
        saveBlog(
          userId,
          blogResponse.url,
          blogResponse.title,
          blogResponse.feedUrl,
          blogResponse.feedType
        );
      } else {
        // show error
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