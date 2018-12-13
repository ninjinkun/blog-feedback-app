import firebase from 'firebase/app';
import 'firebase/auth';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../states/app-state';

export interface UserFetchFirebaseUserAction extends Action {
  type: 'UserFetchFirebaseUserAction';
  auth: firebase.auth.Auth;
}

export function userFetchFirebaseUser(auth: firebase.auth.Auth): UserFetchFirebaseUserAction {
  return {
    type: 'UserFetchFirebaseUserAction',
    auth,
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

export interface UserFirebaseFetchErrorActionction extends Action {
  type: 'UserFirebaseFetchErrorActionction';
  error: Error;
}

export function userFirebaseFetchError(error: Error): UserFirebaseFetchErrorActionction {
  return {
    type: 'UserFirebaseFetchErrorActionction',
    error,
  };
}

export interface UserFirebaseSignoutRequestAction extends Action {
  type: 'UserFirebaseSignoutRequestAction';
}

function userFirebaseSignoutRequest(): UserFirebaseSignoutRequestAction {
  return {
    type: 'UserFirebaseSignoutRequestAction',
  };
}

export interface UserFirebaseSignoutResponseAction extends Action {
  type: 'UserFirebaseSignoutResponseAction';
}

export function userFirebaseSignoutResponse(): UserFirebaseSignoutResponseAction {
  return {
    type: 'UserFirebaseSignoutResponseAction',
  };
}

export interface UserFirebaseSignoutErrorAction extends Action {
  type: 'UserFirebaseSignoutErrorAction';
  error: Error;
}

export function userFirebaseSignoutError(error: Error): UserFirebaseSignoutErrorAction {
  return {
    type: 'UserFirebaseSignoutErrorAction',
    error,
  };
}

export type UserFetchActions =
  | UserFirebaseRequestAction
  | UserFirebaseResponseAction
  | UserFirebaseUnauthorizedResponseAction;
export type UserSignoutActions =
  | UserFirebaseSignoutRequestAction
  | UserFirebaseSignoutResponseAction
  | UserFirebaseSignoutErrorAction;

export type UserActions = UserFetchActions | UserSignoutActions;

export function fetchUser(auth: firebase.auth.Auth): ThunkAction<void, AppState, undefined, UserFetchActions> {
  return async dispatch => {
    try {
      dispatch(userFirebaseUserRequest());
      const user = await currenUserOronAuthStateChanged(auth);
      dispatch(userFirebaseUserResponse(user));
    } catch (e) {
      dispatch(unauthorizedReponse());
    }
  };
}

export function onAuthStateChanged(auth: firebase.auth.Auth): Promise<firebase.User> {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
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
    return onAuthStateChanged(auth);
  }
}

export function signOut(auth: firebase.auth.Auth): ThunkAction<void, AppState, undefined, UserSignoutActions> {
  return async dispatch => {
    try {
      dispatch(userFirebaseSignoutRequest());
      const user = await auth.signOut();
      dispatch(userFirebaseSignoutResponse());
    } catch (e) {
      dispatch(userFirebaseSignoutError(e));
    }
  };
}
