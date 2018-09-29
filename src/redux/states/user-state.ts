import * as firebase from 'firebase';

export type UserState = {
  user?: firebase.User
};

export const initialState: UserState = {};
