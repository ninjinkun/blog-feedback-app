import * as React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import BlogCell from '../../organisms/BlogCell/index';
import ScrollView from '../../atoms/ScrollView/index';
import { AppState } from '../../../redux/states/app-state';
import { BlogState } from '../../../redux/states/blog-state';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { fetchBlogs, BlogActions } from '../../../redux/actions/blog-action';
import { Button } from '../../atoms/Button/index';
import LoadingView from '../../molecules/LoadingView/index';
import Wrapper from '../../atoms/Wrapper/index'; 
import { ThunkDispatch } from 'redux-thunk';

type StateProps = {
  blog: BlogState;
};

type DispatchProps = {
  fetchBlogs: (auth: firebase.auth.Auth) => any;
};

type Props = StateProps & DispatchProps;

class BlogView extends React.PureComponent<Props, {}> {
  componentDidMount() {
    this.fetchBlogs();
  }

  fetchBlogs() {
    this.props.fetchBlogs(firebase.auth());
  }

  render() {
    const { blogs, loading } = this.props.blog;
    if (blogs && blogs.length) {
      return (
        <StyledScrollView>
          {blogs.map((blog) => (
            <BlogCell 
              to={`/blogs/${encodeURIComponent(blog.url)}`} 
              title={blog.title}
              favicon={`https://www.google.com/s2/favicons?domain=${blog.url}`}
              key={blog.url}
            />
          ))}                   
        </StyledScrollView>
      );
    } else if (!loading && blogs && blogs.length === 0) {
      return (<Wrapper><Button>ブログを追加する</Button></Wrapper>);
    }  else if (loading) {
      return (<LoadingView />);
    } else {
      return (<LoadingView />);
    }
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  blog: state.blog
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, undefined, BlogActions>): DispatchProps =>({ 
  fetchBlogs: (auth) => dispatch(fetchBlogs(auth))
})

export default connect(mapStateToProps, mapDispatchToProps)(BlogView);

const StyledScrollView = styled(ScrollView)`
  background-color: white;
  min-height: 100%;
`;
