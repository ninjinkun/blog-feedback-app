import { combineReducers } from 'redux';
import { blogReducer } from './blog-reducer';
import { userReducer } from './user-reducer';
import { addBlogReducer } from './add-blog-reducer';
import { feedsReducer } from './feed-reducer';

export const appReducer = combineReducers({
  blog: blogReducer, 
  user: userReducer,
  addBlog: addBlogReducer,
  feeds: feedsReducer,
});