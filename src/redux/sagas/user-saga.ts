import { call, put } from 'redux-saga/effects';
import {
  currenUserOronAuthStateChanged,
  userFetchFirebaseUser,
  userFirebaseFetchError,
  userFirebaseUserResponse,
} from '../actions/user-action';

export function* fetchFiresbaseUser(auth: firebase.auth.Auth) {
  yield put(userFetchFirebaseUser(auth));
  try {
    const user: firebase.User = yield call(currenUserOronAuthStateChanged, auth);
    yield put(userFirebaseUserResponse(user));
    return user;
  } catch (e) {
    yield put(userFirebaseFetchError(e));
  }
}
