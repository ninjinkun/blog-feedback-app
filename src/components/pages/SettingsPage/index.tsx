import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as React from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { BlogActions, fetchBlogs } from '../../../redux/actions/blog-action';
import { signOut } from '../../../redux/actions/user-action';
import { AppState } from '../../../redux/states/app-state';
import { BlogState } from '../../../redux/states/blog-state';
import { UserState } from '../../../redux/states/user-state';
import { Button } from '../../atoms/Button/index';
import ScrollView from '../../atoms/ScrollView/index';
import Wrapper from '../../atoms/Wrapper/index';
import LoadingView from '../../molecules/LoadingView/index';
import BlogCell from '../../organisms/BlogCell/index';
import SectionHeader from '../../organisms/SettingSectionHeader/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

type StateProps = {
  blogState: BlogState;
  userState: UserState;
};

type DispatchProps = {
  fetchBlogs: (auth: firebase.auth.Auth) => any;
  signOut: (auth: firebase.auth.Auth) => any;
};

type Props = StateProps & DispatchProps & RouteComponentProps;

class SettingsPage extends React.PureComponent<Props, {}> {
  constructor(props: any) {
    super(props);
    this.signOut = this.signOut.bind(this);
  }
  componentDidMount() {
    this.fetchBlogs();
  }

  fetchBlogs() {
    this.props.fetchBlogs(firebase.auth());
  }

  signOut() {
    this.props.signOut(firebase.auth());
  }

  render() {
    const { userState, blogState } = this.props;

    const { blogs, loading } = blogState;
    if (!userState.user && !userState.loading) {
      return <Redirect to="/" />;
    }

    const content = () => {
      if (blogs && blogs.length) {
        return (
          <StyledScrollView>
            <SectionHeader>ブログの設定</SectionHeader>
            {blogs.map(blog => (
              <Link to={`/settings/${encodeURIComponent(blog.url)}`} key={blog.url}>
                <BlogCell title={blog.title} favicon={`https://www.google.com/s2/favicons?domain=${blog.url}`} />
              </Link>
            ))}
            <SectionHeader>ユーザーの設定</SectionHeader>
            <SignOutButtonWrapper>
              <SignOutButton onClick={this.signOut}>ログアウト</SignOutButton>
            </SignOutButtonWrapper>
          </StyledScrollView>
        );
      } else if (loading) {
        return <LoadingView />;
      }
    };

    return (
      <PageLayout
        header={{
          title: '設定',
          backButtonLink: '/',
        }}
      >
        {content()}
      </PageLayout>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  blogState: state.blog,
  userState: state.user,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, undefined, BlogActions>): DispatchProps => ({
  fetchBlogs: auth => dispatch(fetchBlogs(auth)),
  signOut: auth => dispatch(signOut(auth)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPage);

const SignOutButtonWrapper = styled(Wrapper)`
  padding: 16px;
`;

const SignOutButton = styled(Button)`
  width: 100%;
  justify-content: center;
`;

const StyledScrollView = styled(ScrollView)`
  background-color: ${properties.colors.white};
  min-height: 100%;
`;
