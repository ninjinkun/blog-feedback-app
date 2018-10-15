import * as React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import MDSpinner from 'react-md-spinner';
import { Link } from 'react-router-dom';
import BlogCell from '../../organisms/BlogCell/index';
import ScrollView from '../../atoms/ScrollView/index';
import { AppState } from '../../../redux/states/app-state';
import { BlogState } from '../../../redux/states/blog-state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchBlogs } from '../../../redux/actions/blog-action';
import { Button } from '../../atoms/Button/index';
import Wrapper from '../../atoms/Wrapper/index';
import Spinner from '../../atoms/Spinner/index';

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
            <Link to={`/blogs/${encodeURIComponent(blog.url)}`} key={blog.url}>
              <BlogCell
                title={blog.title}
                favicon={`http://www.google.com/s2/favicons?domain=${blog.url}`}
              />
            </Link>
          ))}                   
        </StyledScrollView>
      );
    } else if (!loading && blogs && blogs.length === 0) {
      return (<Wrapper><Button>ブログを追加する</Button></Wrapper>);
    }  else if (loading) {
      return (<SpinnerContainer><Spinner /></SpinnerContainer>);
    } else {
      return (<StyledScrollView />);
    }
  }
}

const mapStateToProps: (state: AppState) => StateProps = (state) => ({
  blog: state.blog
});

function mapDispatchToProps(dispatch: Dispatch<AppState>): DispatchProps {
  return {
    fetchBlogs: (auth: firebase.auth.Auth) => fetchBlogs(auth)(dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogView);

const StyledScrollView = styled(ScrollView)`
  background-color: white;
  min-height: 100%;
`;

const SpinnerContainer = styled(Wrapper)`
  background-color: white;
  width: 100%;
  height: 100%;
  align-items: center;
  padding-top: 16px;
`;
