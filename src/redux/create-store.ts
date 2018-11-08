import { createStore, compose, applyMiddleware } from 'redux';
import { appReducer } from './reducers/app-reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas/feed-saga';

const sagaMiddleware = createSagaMiddleware();
export const appStore = createStore(
  appReducer,
  composeWithDevTools(applyMiddleware(thunk, sagaMiddleware)),  
);
sagaMiddleware.run(rootSaga);
