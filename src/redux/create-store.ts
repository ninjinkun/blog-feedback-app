import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { appReducer } from './reducers/app-reducer';
import feedSaga from './sagas/feed-saga';
import gaSaga from './sagas/ga-saga';

const sagaMiddleware = createSagaMiddleware();
export const appStore = createStore(appReducer, composeWithDevTools(applyMiddleware(thunk, sagaMiddleware)));
sagaMiddleware.run(feedSaga);
sagaMiddleware.run(gaSaga);
