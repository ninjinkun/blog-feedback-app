import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { appReducer } from './reducers/app-reducer';
import rootSaga from './sagas/feed-saga';

const sagaMiddleware = createSagaMiddleware();
export const appStore = createStore(appReducer, composeWithDevTools(applyMiddleware(thunk, sagaMiddleware)));
sagaMiddleware.run(rootSaga);
