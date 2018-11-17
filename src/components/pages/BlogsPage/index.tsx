import * as React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import BlogCell from '../../organisms/BlogCell/index';
import ScrollView from '../../atoms/ScrollView/index';
import { AppState } from '../../../redux/states/app-state';
import { BlogState } from '../../../redux/states/blog-state';
import { connect } from 'react-redux';
import { fetchBlogs, BlogActions } from '../../../redux/actions/blog-action';
import { Button } from '../../atoms/Button/index';
import LoadingView from '../../molecules/LoadingView/index';
import Wrapper from '../../atoms/Wrapper/index';
import { ThunkDispatch } from 'redux-thunk';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';
import PageLayout from '../../templates/PageLayout/index';

type StateProps = {
  blog: BlogState;
};

type DispatchProps = {
  fetchBlogs: (auth: firebase.auth.Auth) => void;
};

type Props = StateProps & DispatchProps & RouteComponentProps<{}> & { dispatch: Dispatch };

class BlogsPage extends React.PureComponent<Props, {}> {
  componentDidMount() {
    this.fetchBlogs();
  }

  fetchBlogs() {
    this.props.fetchBlogs(firebase.auth());
  }

  render() {
    const { history, blog } = this.props;
    const { blogs, loading } = blog;
    return (
      <PageLayout header={{
        title: 'BlogFeedback',
        onAddButtonClick: () => history.push(`/add`)
      }}>
        {(() => {
          if (blogs && blogs.length) {
            return (
              <StyledScrollView>
                {blogs.map((blog) => (
                  <Link to={`/blogs/${encodeURIComponent(blog.url)}`} key={blog.url} >
                    <BlogCell
                      title={blog.title}
                      favicon={`https://www.google.com/s2/favicons?domain=${blog.url}`}
                    />
                  </Link>
                ))}
              </StyledScrollView>
            );
          } else if (!loading && blogs && blogs.length === 0) {
            return (<Wrapper><Button>ブログを追加する</Button></Wrapper>);
          } else if (loading) {
            return (<LoadingView />);
          } else {
            return (<LoadingView />);
          }
        })()}
      </PageLayout>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  blog: state.blog
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, undefined, BlogActions>): DispatchProps => ({
  fetchBlogs: (auth) =>
    (dispatch as ThunkDispatch<AppState, undefined, BlogActions>)(fetchBlogs(auth)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BlogsPage));

const StyledScrollView = styled(ScrollView)`
  background-color: white;
  min-height: 100%;
`;
