import ReactGA from 'react-ga';
import { takeLatest } from 'redux-saga/effects';
import { userSlice } from '../slices/user';


export default function* gaSaga() {
  yield takeLatest(userSlice.actions.firebaseUserResponse.type, handleUserAction);
}

function* handleUserAction(action: ReturnType<typeof userSlice.actions.firebaseUserResponse>) {
  const { payload: user } = action;
  yield ReactGA.set({ userId: user.uid });
  return undefined;
}
