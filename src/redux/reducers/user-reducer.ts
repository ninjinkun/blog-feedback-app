import { Reducer } from 'redux';
import { UserState, initialState } from '../states/user-state';
import { UserActions } from '../actions/user-action';

export const userReducer: Reducer<UserState, UserActions> = (state = initialState, action) => {
  switch (action.type) {
    case 'UserFirebaseRequestAction':
      return { ...state, loading: true };
    case 'UserFirebaseResponseAction':
      const { user } = action;
      return { ...state, user, loading: false };
    case 'UserFirebaseUnauthorizedResponseAction':
      return { ...state, loading: false };
    case 'UserFirebaseSignoutResponseAction':
      return initialState;
    default:
      return state;
  }
};