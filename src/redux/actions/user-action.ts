import firebase from 'firebase/app';
import 'firebase/auth';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../states/app-state';

export const FIREBASE_USER_REQUEST = 'user/FIREBASE_REQUEST';
export function userFirebaseUserRequest() {
  return {
    type: FIREBASE_USER_REQUEST as typeof FIREBASE_USER_REQUEST,
  };
}

export const FIREBASE_USER_RESPONSE = 'user/FIREBASE_RESPONSE';
export function userFirebaseUserResponse(user: firebase.User) {
  return {
    type: FIREBASE_USER_RESPONSE as typeof FIREBASE_USER_RESPONSE,
    user,
  };
}
export type UserFirebaseUserResponseAction = ReturnType<typeof userFirebaseUserResponse>;

export const FIREBASE_USER_UNAUTHORIZED_ERROR = 'user/FIREBASE_UNAUTHORIZED_ERROR';
function userFirebaseUserUnauthorizedError() {
  return {
    type: FIREBASE_USER_UNAUTHORIZED_ERROR as typeof FIREBASE_USER_UNAUTHORIZED_ERROR,
  };
}

export const FIREBASE_USER_ERROR = 'user/FIREBASE_ERROR';
export function userFirebaseUserError(error: Error) {
  return {
    type: FIREBASE_USER_ERROR as typeof FIREBASE_USER_ERROR,
    error,
  };
}

export type UserFetchActions =
  | ReturnType<typeof userFirebaseUserRequest>
  | ReturnType<typeof userFirebaseUserResponse>
  | ReturnType<typeof userFirebaseUserError>
  | ReturnType<typeof userFirebaseUserUnauthorizedError>;

export const FIREBASE_SIGNOUT_REQUEST = 'user/signout/FIREBASE_REQUEST';
function userFirebaseSignoutRequest() {
  return {
    type: FIREBASE_SIGNOUT_REQUEST as typeof FIREBASE_SIGNOUT_REQUEST,
  };
}

export const FIREBASE_SIGNOUT_RESPONSE = 'user/signout/FIREBASE_RESPONSE';
export function userFirebaseSignoutResponse() {
  return {
    type: FIREBASE_SIGNOUT_RESPONSE as typeof FIREBASE_SIGNOUT_RESPONSE,
  };
}

export const FIREBASE_SIGNOUT_ERROR = 'user/signout/FIREBASE_ERROR';
export function userFirebaseSignoutError(error: Error) {
  return {
    type: FIREBASE_SIGNOUT_ERROR as typeof FIREBASE_SIGNOUT_ERROR,
    error,
  };
}

export type UserSignoutActions =
  | ReturnType<typeof userFirebaseSignoutRequest>
  | ReturnType<typeof userFirebaseSignoutResponse>
  | ReturnType<typeof userFirebaseSignoutError>;

export type UserActions = UserFetchActions | UserSignoutActions;

export function fetchUser(auth: firebase.auth.Auth): ThunkAction<void, AppState, undefined, UserFetchActions> {
  return async dispatch => {
    try {
      dispatch(userFirebaseUserRequest());
      const user = await currenUserOronAuthStateChanged(auth);
      dispatch(userFirebaseUserResponse(user));
    } catch (e) {
      dispatch(userFirebaseUserUnauthorizedError());
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
      await auth.signOut();
      dispatch(userFirebaseSignoutResponse());
    } catch (e) {
      dispatch(userFirebaseSignoutError(e));
    }
  };
}
