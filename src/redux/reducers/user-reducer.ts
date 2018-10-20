import { Reducer } from 'redux';
import { AddBlogState, initialState } from '../states/add-blog-state';
import { UserActions } from '../actions/user-action';

export const userReducer: Reducer<AddBlogState> = (state = initialState, action: UserActions) => {
  switch (action.type) {
    case 'UserFirebaseRequestAction':
      return { ...state, loading: true };
    case 'UserFirebaseResponseAction':
      const { user } = action;
      return { ...state, user, loading: false };
    default:
      return state;
  }
};