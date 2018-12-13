import firebase from 'firebase/app';
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
import { PrimaryButton } from '../../atoms/Button/index';
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
    const { blog } = this.props;
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
              <AddBlogWrapper>
                <h2>ご登録ありがとうございます</h2>
                <WelcomeImage src={require('../../../assets/images/welcome-image.png')} />
                <p>ブログを追加して利用を開始しましょう</p>
                <StyledPrimaryButton href="/add" as="a">
                  ブログを追加する
                </StyledPrimaryButton>
              </AddBlogWrapper>
            );
          } else {
            return <LoadingView />;
          }
        })()}
      </PageLayout>
    );
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    blog: state.blog,
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<AppState, undefined, BlogActions>): DispatchProps {
  return {
    fetchBlogs: auth => dispatch(fetchBlogs(auth)),
  };
}

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

const AddBlogWrapper = styled(Wrapper)`
  justify-content: center;
  width: 100%;
  align-items: center;
  padding: 16px;
`;

const StyledPrimaryButton = styled(PrimaryButton)`
  justify-content: center;
`;

const WelcomeImage = styled.img`
  width: 235px;
  height: 185px;
  margin: 16px;
`;
