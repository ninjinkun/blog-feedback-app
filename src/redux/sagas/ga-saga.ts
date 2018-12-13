import ReactGA from 'react-ga';
import { takeLatest } from 'redux-saga/effects';
import { UserFirebaseResponseAction } from '../actions/user-action';

export default function* gaSaga() {
  yield takeLatest('UserFirebaseResponseAction', handleUserAction);
}

function* handleUserAction(action: UserFirebaseResponseAction) {
  const { user } = action;
  ReactGA.set({ userId: user.uid });
  return undefined;
}
