import { Reducer } from 'redux';
import { AddBlogState, initialState } from '../states/add-blog-state';
import { UserActions } from '../actions/user-action';

export const userReducer: Reducer<AddBlogState, UserActions> = (state = initialState, action) => {
  switch (action.type) {
    case 'UserFirebaseRequestAction':
      return { ...state, loading: true };
    case 'UserFirebaseResponseAction':
      const { user } = action;
      return { ...state, user, loading: false };
    case 'UserFirebaseUnauthorizedResponseAction':
      return { ...state, loading: false };
    default:
      return state;
  }
};