import { combineReducers } from 'redux';
import { blogReducer } from './blog-reducer';

export const appReducer = combineReducers({blog: blogReducer});