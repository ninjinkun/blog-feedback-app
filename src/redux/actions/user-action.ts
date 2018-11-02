import { Dispatch, Action, ActionCreator, bindActionCreators } from 'redux';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AppState } from '../states/app-state';
import { ThunkAction } from 'redux-thunk';

export interface UserFirebaseRequestAction extends Action {
  type: 'UserFirebaseRequestAction';
}

const userRequest = (): UserFirebaseRequestAction => ({
  type: 'UserFirebaseRequestAction',
});

export interface UserFirebaseResponseAction extends Action {
  type: 'UserFirebaseResponseAction';
  user: firebase.User;
}

const userResponse = (user: firebase.User): UserFirebaseResponseAction => ({
  type: 'UserFirebaseResponseAction',
  user: user,
});

export interface UserFirebaseUnauthorizedResponseAction extends Action {
  type: 'UserFirebaseUnauthorizedResponseAction';
}

const unauthorizedReponse = (): UserFirebaseUnauthorizedResponseAction => ({
  type: 'UserFirebaseUnauthorizedResponseAction',
});
export type UserActions = UserFirebaseRequestAction | UserFirebaseResponseAction | UserFirebaseUnauthorizedResponseAction;

type UserCallback = (user: firebase.User | null) => any;
export const fetchUser = (auth: firebase.auth.Auth, callback?: UserCallback): ThunkAction<void, AppState, undefined, UserActions>  => 
  (dispatch, getState) => {
  dispatch(userRequest());
  auth.onAuthStateChanged((user) => {
    if (user) {
      dispatch(userResponse(user));
    } else {
      dispatch(unauthorizedReponse());
    }
    if (callback) {
      callback(user);
    }
  });
};

export const fetchOrCurrenUser = (auth: firebase.auth.Auth,  callback: (user: firebase.User | null) => any): ThunkAction<void, AppState, undefined, UserActions> => (dispatch, getState) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    callback(currentUser);
  } else {
    dispatch(fetchUser(auth, callback));
  }
} 

