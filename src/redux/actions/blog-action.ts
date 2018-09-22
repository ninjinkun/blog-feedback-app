import { Dispatch, Action, ActionCreator, bindActionCreators } from 'redux';

import { BlogEntity } from '../../models/entities';
import { BlogRepository } from '../../models/repositories';

export interface BlogRequestAction extends Action {
  type: 'BlogReuqestAction';
}

const blogRequest: ActionCreator<BlogRequestAction> = () => ({
  type: 'BlogReuqestAction',
});

export interface BlogResponseAction extends Action {
  type: 'BlogResponseAction';
  response: BlogEntity[];
}

export const blogResponseActionCreator: ActionCreator<BlogResponseAction> = (response: BlogEntity[]) => ({
  type: 'BlogResponseAction',
  'response': response
});

export const fetchBlogsAsyncAction = (userId: string) => async (dispatch: Dispatch<BlogRequestAction|BlogResponseAction>) => {
  dispatch(blogRequest());
  const blogs = await BlogRepository.getBlogs(userId);
  dispatch(blogResponseActionCreator(blogs));
};

export type BlogActions = BlogRequestAction|BlogResponseAction;
 