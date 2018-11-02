import { createStore, compose, applyMiddleware } from 'redux';
import { appReducer } from './reducers/app-reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

export const appStore = createStore(
  appReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);
