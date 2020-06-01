import { createSlice, ThunkAction } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import 'firebase/auth';

export type UserState = {
  user?: firebase.User;
  loading: boolean;
};

export const initialState: UserState = { loading: true };

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    firebaseUserRequest(state) {
      return { ...state, loading: true };
    },
    firebaseUserResponse(state, action: { payload: firebase.User }) {
      return { ...state, user: action.payload, loading: false };
    },
    firebaseUnauthorizedError(state) {
      return { ...state, loading: false };
    },
    firebaseSignoutResponse(state) {
      return { ...initialState, loading: false };
    },
    firebaseSignoutRequest(state) {
      return state;
    },
    firebaseSignoutError(state, action: { payload: Error }) {
      return state;
    },
  },
});

export function fetchUser(auth: firebase.auth.Auth): ThunkAction<void, UserState, undefined, any> {
  return async (dispatch) => {
    console.log('hogehogheogheo!');
    try {
      dispatch(userSlice.actions.firebaseUserRequest());
      const user = await currenUserOronAuthStateChanged(auth);
      dispatch(userSlice.actions.firebaseUserResponse(user));
    } catch (e) {
      dispatch(userSlice.actions.firebaseUnauthorizedError());
    }
  };
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
    return onAuthStateChanged(auth);
  }
}

export function signOut(auth: firebase.auth.Auth): ThunkAction<void, UserState, undefined, any> {
  return async (dispatch) => {
    try {
      dispatch(userSlice.actions.firebaseSignoutRequest());
      await auth.signOut();
      dispatch(userSlice.actions.firebaseSignoutResponse());
    } catch (e) {
      dispatch(userSlice.actions.firebaseSignoutError(e));
    }
  };
}
