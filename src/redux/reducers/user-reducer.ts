import { Reducer } from 'redux';
import { UserState, initialState } from '../states/user-state';
import { AddBlogActions } from '../actions/add-blog-action';

export const userReducer: Reducer<UserState> = (state = initialState, action: AddBlogActions) => {
  switch (action.type) {
    case 'AddBlogRequestAction':
      return { ...state, loading: true };
    case 'AddBlogResponseAction':
      return { ...state, loading: false };
    default:
      return state;
  }
};