import { combineReducers } from 'redux';
import { blogReducer } from './blog-reducer';
import { addBlogReducer } from './add-blog-reducer';
import { userReducer } from './user-reducer';
import { feedsReducer } from './feed-reducer';
import { deleteBlogReducer } from './delete-blog-reducer';

export const appReducer = combineReducers({
  blog: blogReducer, 
  user: userReducer,
  addBlog: addBlogReducer,
  deleteBlog: deleteBlogReducer,
  feeds: feedsReducer,
});