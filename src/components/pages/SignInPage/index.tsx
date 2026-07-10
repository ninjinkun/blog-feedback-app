import {
  AuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  getAuth,
  signInWithPopup,
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { FaFacebook, FaGoogle, FaTwitter } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/hooks';
import { Location, Navigate, useLocation } from 'react-router';
import styled from 'styled-components';
import { AppState } from '../../../redux/app-reducer';
import { UserState, fetchUser } from '../../../redux/slices/user';
import Anker from '../../atoms/Anker/index';
import Wrapper from '../../atoms/Wrapper/index';
import LoadingView from '../../molecules/LoadingView/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

const SignInPage: React.FC = () => {
  const userState = useSelector<AppState, UserState>((state) => state.user);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    dispatch(fetchUser(getAuth()));
    return () => undefined;
  }, [dispatch]);

  const signIn = async (provider: AuthProvider) => {
    try {
      setError(undefined);
      await signInWithPopup(getAuth(), provider);
      dispatch(fetchUser(getAuth()));
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      }
    }
  };

  const { loading, user } = userState;
  if (user) {
    const from =
      ((location.state as { from?: Location } | undefined) && (location.state as { from?: Location }).from) || '/blogs';
    return <Navigate to={from} replace />;
  } else {
    return (
      <PageLayout
        header={{
          title: 'ユーザー登録 / ログイン（無料）',
          backButtonLink: '/',
        }}
      >
        {(() => {
          if (loading && !user) {
            return <LoadingView />;
          } else {
            return (
              <StyledWrapper>
                <SignInButtons>
                  <GoogleButton onClick={() => signIn(new GoogleAuthProvider())}>
                    <FaGoogle />
                    Google でログイン
                  </GoogleButton>
                  <TwitterButton onClick={() => signIn(new TwitterAuthProvider())}>
                    <FaTwitter />
                    Twitter でログイン
                  </TwitterButton>
                  <FacebookButton onClick={() => signIn(new FacebookAuthProvider())}>
                    <FaFacebook />
                    Facebook でログイン
                  </FacebookButton>
                </SignInButtons>
                {error ? <ErrorText>ログインに失敗しました: {error.message}</ErrorText> : undefined}

                <TextWrapper>
                  <Text>
                    続行すると、
                    <Anker href="/term" target="_blank">
                      利用規約
                    </Anker>
                    および
                    <Anker href="/privacy" target="_blank">
                      プライバシーポリシー
                    </Anker>
                    に同意したことになります。
                  </Text>
                  <Text>
                    SNSログインの情報は認証とメールアドレスの登録のみに使用されます。無断でSNSに投稿されることはありません。
                  </Text>
                  <Text>登録したデータはプライベートになり、他のユーザーから閲覧されることはありません。</Text>
                </TextWrapper>
              </StyledWrapper>
            );
          }
        })()}
      </PageLayout>
    );
  }
};

export default SignInPage;

const StyledWrapper = styled(Wrapper)`
  align-items: center;
  margin-top: 16px;
`;

const SignInButtons = styled(Wrapper)`
  width: 240px;
  gap: 12px;
`;

const SignInButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: ${properties.fontSizes.m};
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

  &:active {
    opacity: 0.8;
  }
`;

const GoogleButton = styled(SignInButton)`
  background-color: #4285f4;
`;

const TwitterButton = styled(SignInButton)`
  background-color: #55acee;
`;

const FacebookButton = styled(SignInButton)`
  background-color: #3b5998;
`;

const TextWrapper = styled(Wrapper)`
  max-width: 360px;
  padding: 16px 24px 0 24px;
`;

const Text = styled.p`
  font-size: ${properties.fontSizes.s};
  color: ${properties.colors.grayDark};
  line-height: 1.4em;
  margin: 0.5em 0;
`;

const ErrorText = styled.p`
  font-size: ${properties.fontSizes.s};
  color: red;
  padding: 0 24px;
`;
