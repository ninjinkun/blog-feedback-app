import { Dispatch, Action, ActionCreator, bindActionCreators } from 'redux';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AppState } from '../states/app-state';
import { ThunkAction } from 'redux-thunk';

export interface UserFetchFirebaseUserAction extends Action {
  type: 'UserFetchFirebaseUserAction';
  auth: firebase.auth.Auth;
}

export function userFetchFirebaseUser(auth: firebase.auth.Auth): UserFetchFirebaseUserAction {
  return {
    type: 'UserFetchFirebaseUserAction',
    auth  
  };
}

export interface UserFirebaseRequestAction extends Action {
  type: 'UserFirebaseRequestAction';
}

function userFirebaseUserRequest(): UserFirebaseRequestAction {
  return {
    type: 'UserFirebaseRequestAction',
  };
}

export interface UserFirebaseResponseAction extends Action {
  type: 'UserFirebaseResponseAction';
  user: firebase.User;
}

export function userFirebaseUserResponse(user: firebase.User): UserFirebaseResponseAction {
  return {
    type: 'UserFirebaseResponseAction',
    user,
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

export interface UserFirebaseErrorAction extends Action {
  type: 'UserFirebaseErrorAction';
  error: Error;
}

export function userFirebaseError(error: Error): UserFirebaseErrorAction {
  return {
    type: 'UserFirebaseErrorAction',
    error,
  }
}

export type UserActions = UserFirebaseRequestAction | UserFirebaseResponseAction | UserFirebaseUnauthorizedResponseAction;

type UserCallback = (user: firebase.User | null) => any;
export function fetchUser(auth: firebase.auth.Auth, callback?: UserCallback): ThunkAction<void, AppState, undefined, UserActions> {
  return (dispatch, getState) => {
    dispatch(userFirebaseUserRequest());
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(userFirebaseUserResponse(user));
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

export function onAuthStateChanged(auth: firebase.auth.Auth): Promise<firebase.User> {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User login failed'));
      }
    });
  });
}

export async function currenUserOronAuthStateChanged(auth: firebase.auth.Auth): Promise<firebase.User> {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return currentUser;
  } else {
    try {
      return await onAuthStateChanged(auth);
    } catch (e) {
      throw e;
    }
  }
}