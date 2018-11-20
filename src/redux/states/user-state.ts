import * as firebase from 'firebase/app';
import 'firebase/auth';

export type UserState = {
  user?: firebase.User,
  loading: boolean,
};

export const initialState: UserState = { loading: true };
