import ReactGA from 'react-ga';
import { takeLatest } from 'redux-saga/effects';
import { FIREBASE_USER_RESPONSE, UserFirebaseUserResponseAction } from '../actions/user-action';

export default function* gaSaga() {
  yield takeLatest(FIREBASE_USER_RESPONSE, handleUserAction);
}

function* handleUserAction(action: UserFirebaseUserResponseAction) {
  const { user } = action;
  ReactGA.set({ userId: user.uid });
  return undefined;
}
