import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import styled from 'styled-components';

import { FaDonate, FaGithub, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import { FiGithub, FiHeart } from 'react-icons/fi';
import { MdAssignment, MdAssignmentInd, MdLaunch, MdOpenInBrowser } from 'react-icons/md';
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
import PlainCell from '../../molecules/PlainCell/index';
import BlogCell from '../../organisms/BlogCell/index';
import SettingCell from '../../organisms/SettingCell/index';
import SectionHeader from '../../organisms/SettingSectionHeader/index';
import SocialButtons from '../../organisms/SocialButtons/index';
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

    const blogCells = (
      <React.Fragment>
        {(blogs && blogs.length) || loading ? <SectionHeader>ブログの設定</SectionHeader> : undefined}
        {(() => {
          if (blogs && blogs.length) {
            return blogs.map(blog => (
              <Link to={`/settings/${encodeURIComponent(blog.url)}`} key={blog.url}>
                <BlogCell title={blog.title} favicon={`https://www.google.com/s2/favicons?domain=${blog.url}`} />
              </Link>
            ));
          } else if (loading) {
            return <LoadingView />;
          }
        })()}
      </React.Fragment>
    );
    const content = () => {
      return (
        <StyledScrollView>
          {blogCells}
          <SectionHeader>ユーザーの設定</SectionHeader>
          <SignOutButtonWrapper>
            <SignOutButton onClick={this.signOut}>ログアウト</SignOutButton>
          </SignOutButtonWrapper>
          <SectionHeader>サービスの情報</SectionHeader>
          <Link to="/term" target="_blank">
            <SettingCell title="サービス利用規約" LeftIcon={<MdAssignment size="16" />} />
          </Link>
          <Link to="/privacy" target="_blank">
            <SettingCell title="プライバシーポリシー" LeftIcon={<MdAssignmentInd size="16" />} />
          </Link>
          <a href="https://github.com/ninjinkun/blog-feedback-app" target="_blank">
            <SettingCell
              title="要望・PullRequest (Github)"
              LeftIcon={<FiGithub size="16" />}
              RightIcon={<MdLaunch size="24" color={properties.colors.gray} />}
            />
          </a>
          <StyledSocialButtons />
        </StyledScrollView>
      );
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

function mapStateToProps(state: AppState): StateProps {
  return {
    blogState: state.blog,
    userState: state.user,
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<AppState, undefined, BlogActions>): DispatchProps {
  return {
    fetchBlogs: auth => dispatch(fetchBlogs(auth)),
    signOut: auth => dispatch(signOut(auth)),
  };
}

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

const StyledSocialButtons = styled(SocialButtons)`
  margin: 16px 16px 24px 16px;
`;
