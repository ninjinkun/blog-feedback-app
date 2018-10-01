import { Dispatch, Action, ActionCreator, bindActionCreators } from 'redux';

import { BlogEntity } from '../../models/entities';
import { fetchUser } from './user-action';
import { findAllBlogs } from '../../models/repositories/blog-repository';

export interface BlogFirebaseRequestAction extends Action {
  type: 'BlogFirebaseRequestAction';
}

const blogRequest: ActionCreator<BlogFirebaseRequestAction> = () => ({
  type: 'BlogFirebaseRequestAction',
});

export interface BlogFirebaseResponseAction extends Action {
  type: 'BlogFirebaseResponseAction';
  blogs: BlogEntity[];
}

export const blogResponse: ActionCreator<BlogFirebaseResponseAction> = (blogs: BlogEntity[]) => ({
  type: 'BlogFirebaseResponseAction',
  blogs: blogs
});

export const fetchBlogs = (auth: firebase.auth.Auth) =>
  (dispatch: Dispatch<BlogFirebaseRequestAction | BlogFirebaseResponseAction>) => {
    const f = async (uid: string) => {
      dispatch(blogRequest());
      const blogs = await findAllBlogs(uid);
      dispatch(blogResponse(blogs));
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

export type BlogActions = BlogFirebaseRequestAction | BlogFirebaseResponseAction;
