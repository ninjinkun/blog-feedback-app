import { Reducer } from 'redux';
import {
  FIREBASE_SIGNOUT_RESPONSE,
  FIREBASE_USER_REQUEST,
  FIREBASE_USER_RESPONSE,
  FIREBASE_USER_UNAUTHORIZED_ERROR,
  UserActions,
} from '../actions/user-action';
import { initialState, UserState } from '../states/user-state';

export const userReducer: Reducer<UserState, UserActions> = (state = initialState, action) => {
  switch (action.type) {
    case FIREBASE_USER_REQUEST:
      return { ...state, loading: true };
    case FIREBASE_USER_RESPONSE:
      const { user } = action;
      return { ...state, user, loading: false };
    case FIREBASE_USER_UNAUTHORIZED_ERROR:
      return { ...state, loading: false };
    case FIREBASE_SIGNOUT_RESPONSE:
      return { ...initialState, loading: false };
    default:
      return state;
  }
};
