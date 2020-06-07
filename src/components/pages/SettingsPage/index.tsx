import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { FiGithub } from 'react-icons/fi';
import { MdAssignment, MdAssignmentInd, MdLaunch } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { signOut } from '../../../redux/slices/user';
import { AppState } from '../../../redux/app-reducer';
import { BlogState, fetchBlogs } from '../../../redux/slices/blog';
import { Button } from '../../atoms/Button/index';
import ScrollView from '../../atoms/ScrollView/index';
import Wrapper from '../../atoms/Wrapper/index';
import LoadingView from '../../molecules/LoadingView/index';
import BlogCell from '../../organisms/BlogCell/index';
import SettingCell from '../../organisms/SettingCell/index';
import SectionHeader from '../../organisms/SettingSectionHeader/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

const SettingsPage: React.FC<RouteComponentProps> = () => {
  const blogState = useSelector<AppState, BlogState>((state) => state.blog);
  const { blogs, loading } = blogState;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBlogs(firebase.auth()));
    return () => undefined;
  }, [dispatch]);

  const blogCells = (
    <React.Fragment>
      {(blogs && blogs.length) || loading ? <SectionHeader>ブログの設定</SectionHeader> : undefined}
      {(() => {
        if (blogs && blogs.length) {
          return blogs.map((blog) => (
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

  return (
    <PageLayout
      header={{
        title: '設定',
        backButtonLink: '/',
      }}
    >
      <StyledScrollView>
        {blogCells}
        <SectionHeader>ユーザーの設定</SectionHeader>
        <SignOutButtonWrapper>
          <SignOutButton onClick={() => dispatch(signOut(firebase.auth()))}>ログアウト</SignOutButton>
        </SignOutButtonWrapper>
        <SectionHeader>サービスの情報</SectionHeader>
        <Link to="/term" target="_blank">
          <SettingCell title="サービス利用規約" LeftIcon={<MdAssignment size="16" />} />
        </Link>
        <Link to="/privacy" target="_blank">
          <SettingCell title="プライバシーポリシー" LeftIcon={<MdAssignmentInd size="16" />} />
        </Link>
        <a href="https://github.com/ninjinkun/blog-feedback-app" target="_blank" rel="noopener noreferrer">
          <SettingCell
            title="要望・PullRequest (Github)"
            LeftIcon={<FiGithub size="16" />}
            RightIcon={<MdLaunch size="24" color={properties.colors.gray} />}
          />
        </a>
      </StyledScrollView>
    </PageLayout>
  );
};

export default SettingsPage;

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
