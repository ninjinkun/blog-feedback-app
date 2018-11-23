import { call, put, takeEvery, all, take, fork } from 'redux-saga/effects'
import { currenUserOronAuthStateChanged, userFirebaseUserResponse, UserFetchFirebaseUserAction, userFetchFirebaseUser, userFirebaseFetchError } from '../actions/user-action';

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
