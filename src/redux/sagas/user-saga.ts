import { call, put } from 'redux-saga/effects';
import {
  currenUserOronAuthStateChanged,
  userFirebaseUserError,
  userFirebaseUserRequest,
  userFirebaseUserResponse,
} from '../actions/user-action';

export function* fetchFiresbaseUser(auth: firebase.auth.Auth) {
  yield put(userFirebaseUserRequest());
  try {
    const user: firebase.User = yield call(currenUserOronAuthStateChanged, auth);
    yield put(userFirebaseUserResponse(user));
    return user;
  } catch (e) {
    yield put(userFirebaseUserError(e));
  }
}
