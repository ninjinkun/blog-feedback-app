import { Reducer } from 'redux';
import { UserActions } from '../actions/user-action';
import { initialState, UserState } from '../states/user-state';

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
      return { ...initialState, loading: false };
    default:
      return state;
  }
};
