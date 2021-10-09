import { createSlice, ThunkAction, PayloadAction } from '@reduxjs/toolkit';
import { User, Auth } from '@firebase/auth';

export type UserState = {
  user?: User;
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
    firebaseUserResponse(state, action: PayloadAction<User>) {
      return { ...state, user: action.payload, loading: false };
    },
    firebaseUnauthorizedError(state, action: PayloadAction<Error>) {
      return { ...state, loading: false };
    },
    firebaseSignoutResponse(state) {
      return { ...initialState, loading: false };
    },
    firebaseSignoutRequest(state) {
      return state;
    },
    firebaseSignoutError(state, action: PayloadAction<Error>) {
      return state;
    },
  },
});

export function fetchUser(auth: Auth): ThunkAction<void, UserState, undefined, any> {
  return async (dispatch) => {
    try {
      dispatch(userSlice.actions.firebaseUserRequest());
      const user = await currenUserOronAuthStateChanged(auth);
      dispatch(userSlice.actions.firebaseUserResponse(JSON.parse(JSON.stringify(user))));
    } catch (e) {
      if (e instanceof Error) {
        dispatch(userSlice.actions.firebaseUnauthorizedError(e));
      }
    }
  };
}

export function onAuthStateChanged(auth: Auth): Promise<User> {
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

export async function currenUserOronAuthStateChanged(auth: Auth): Promise<User> {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return currentUser;
  } else {
    return onAuthStateChanged(auth);
  }
}

export function signOut(auth: Auth): ThunkAction<void, UserState, undefined, any> {
  return async (dispatch) => {
    try {
      dispatch(userSlice.actions.firebaseSignoutRequest());
      await auth.signOut();
      dispatch(userSlice.actions.firebaseSignoutResponse());
    } catch (e) {
      if (e instanceof Error) {
        dispatch(userSlice.actions.firebaseSignoutError(e));
      }
    }
  };
}
