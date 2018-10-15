import { Dispatch, Action, ActionCreator, bindActionCreators } from 'redux';
import * as firebase from 'firebase';
import { AppState } from '../states/app-state';

export interface UserFirebaseRequestAction extends Action {
  type: 'UserFirebaseRequestAction';
}

const userRequest: ActionCreator<UserFirebaseRequestAction> = () => ({
  type: 'UserFirebaseRequestAction',
});

export interface UserFirebaseResponseAction extends Action {
  type: 'UserFirebaseResponseAction';
  user: firebase.User;
}

const userResponse: ActionCreator<UserFirebaseResponseAction> = (user: firebase.User) => ({
  type: 'UserFirebaseResponseAction',
  user: user,
});

export const fetchUser = (auth: firebase.auth.Auth, callback?: (user: firebase.User | null) => any) => (dispatch: Dispatch<AppState>) => {
  dispatch(userRequest());
  auth.onAuthStateChanged((user) => {
    if (user) {
      dispatch(userResponse(user));
    }
    if (callback) {
      callback(user);
    }
  });
};

export type UserActions = UserFirebaseRequestAction | UserFirebaseResponseAction;