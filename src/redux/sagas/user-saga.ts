import { call, put } from 'redux-saga/effects';
import { userSlice, currenUserOronAuthStateChanged } from '../slices/user';

export function* fetchFiresbaseUser(auth: firebase.auth.Auth) {
  yield put(userSlice.actions.firebaseUserRequest());
  try {
    const user: firebase.User = yield call(currenUserOronAuthStateChanged, auth);
    yield put(userSlice.actions.firebaseUserResponse(JSON.parse(JSON.stringify(user))));
    return user;
  } catch (e) {
    yield put(userSlice.actions.firebaseUnauthorizedError(e));
  }
}
