import { Auth, User } from '@firebase/auth';
import { call, put } from 'redux-saga/effects';
import { userSlice, currenUserOronAuthStateChanged } from '../slices/user';

export function* fetchFiresbaseUser(auth: Auth) {
  yield put(userSlice.actions.firebaseUserRequest());
  try {
    const user: User = yield call(currenUserOronAuthStateChanged, auth);
    yield put(userSlice.actions.firebaseUserResponse(JSON.parse(JSON.stringify(user))));
    return user;
  } catch (e) {
    if (e instanceof Error) {
      yield put(userSlice.actions.firebaseUnauthorizedError(e));
    }
  }
}
