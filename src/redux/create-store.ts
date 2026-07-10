import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { appReducer } from './app-reducer';
import feedSaga from './sagas/feed-saga';
import gaSaga from './sagas/ga-saga';

const sagaMiddleware = createSagaMiddleware();
export const appStore = configureStore({
  reducer: appReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});
sagaMiddleware.run(feedSaga);
sagaMiddleware.run(gaSaga);

export type AppDispatch = typeof appStore.dispatch;
