import * as firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { BlogActions, fetchBlogs } from '../../../redux/actions/blog-action';
import { AppState } from '../../../redux/states/app-state';
import { BlogState } from '../../../redux/states/blog-state';
import { Button } from '../../atoms/Button/index';
import ScrollView from '../../atoms/ScrollView/index';
import Wrapper from '../../atoms/Wrapper/index';
import LoadingView from '../../molecules/LoadingView/index';
import BlogCell from '../../organisms/BlogCell/index';
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
      <PageLayout
        header={{
          title: 'BlogFeedback',
          addButtonLink: '/add',
          settingButtonLink: '/settings',
        }}
      >
        {(() => {
          if (blogs && blogs.length) {
            return (
              <StyledScrollView>
                {blogs.map(blog => (
                  <Link to={`/blogs/${encodeURIComponent(blog.url)}`} key={blog.url}>
                    <BlogCell title={blog.title} favicon={`https://www.google.com/s2/favicons?domain=${blog.url}`} />
                  </Link>
                ))}
              </StyledScrollView>
            );
          } else if (!loading && blogs && blogs.length === 0) {
            return (
              <Wrapper>
                <Button>ブログを追加する</Button>
              </Wrapper>
            );
          } else if (loading) {
            return <LoadingView />;
          } else {
            return <LoadingView />;
          }
        })()}
      </PageLayout>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  blog: state.blog,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, undefined, BlogActions>): DispatchProps => ({
  fetchBlogs: auth => dispatch(fetchBlogs(auth)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BlogsPage)
);

const StyledScrollView = styled(ScrollView)`
  background-color: white;
  min-height: 100%;
`;
