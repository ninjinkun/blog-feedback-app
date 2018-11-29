import { call, put } from 'redux-saga/effects';
import {
  currenUserOronAuthStateChanged,
  userFetchFirebaseUser,
  UserFetchFirebaseUserAction,
  userFirebaseFetchError,
  userFirebaseUserResponse,
} from '../actions/user-action';

export function* fetchFiresbaseUser(action: UserFetchFirebaseUserAction) {
  const { auth } = action;
  yield put(userFetchFirebaseUser(auth));
  try {
    const user: firebase.User = yield call(currenUserOronAuthStateChanged, auth);
    yield put(userFirebaseUserResponse(user));
  } catch (e) {
    yield put(userFirebaseFetchError(e));
  }
}
