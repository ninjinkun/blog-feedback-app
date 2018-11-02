import { Dispatch, Action, ActionCreator, bindActionCreators } from 'redux';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AppState } from '../states/app-state';
import { ThunkAction } from 'redux-thunk';

export interface UserFirebaseRequestAction extends Action {
  type: 'UserFirebaseRequestAction';
}

function userRequest(): UserFirebaseRequestAction {
  return {
    type: 'UserFirebaseRequestAction',
  };
}

export interface UserFirebaseResponseAction extends Action {
  type: 'UserFirebaseResponseAction';
  user: firebase.User;
}

function userResponse(user: firebase.User): UserFirebaseResponseAction {
  return {
    type: 'UserFirebaseResponseAction',
    user: user,
  };
}

export interface UserFirebaseUnauthorizedResponseAction extends Action {
  type: 'UserFirebaseUnauthorizedResponseAction';
}

function unauthorizedReponse(): UserFirebaseUnauthorizedResponseAction {
  return {
    type: 'UserFirebaseUnauthorizedResponseAction',
  };
}
export type UserActions = UserFirebaseRequestAction | UserFirebaseResponseAction | UserFirebaseUnauthorizedResponseAction;

type UserCallback = (user: firebase.User | null) => any;
export function fetchUser(auth: firebase.auth.Auth, callback?: UserCallback): ThunkAction<void, AppState, undefined, UserActions> {
  return (dispatch, getState) => {
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
}

export function fetchOrCurrenUser(auth: firebase.auth.Auth,  callback: (user: firebase.User | null) => any): ThunkAction<void, AppState, undefined, UserActions> {
  return (dispatch, getState) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      callback(currentUser);
    } else {
      dispatch(fetchUser(auth, callback));
    }
  } 
}
