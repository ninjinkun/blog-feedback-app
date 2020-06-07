import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Location } from 'history';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { UserState, fetchUser } from '../../../redux/slices/user';
import { AppState } from '../../../redux/app-reducer';
import Anker from '../../atoms/Anker/index';
import Wrapper from '../../atoms/Wrapper/index';
import LoadingView from '../../molecules/LoadingView/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

type Props = RouteComponentProps<{}, {}, { from?: Location }>;

const SignInPage: React.FC<Props> = (props) => {
  const userState = useSelector<AppState, UserState>((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser(firebase.auth()));
    return () => undefined;
  }, [dispatch]);

  const { loading, user } = userState;
  if (user) {
    const from = (props.location.state && props.location.state.from) || 'blogs';
    return <Redirect to={from} />;
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
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />

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

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/signin',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};

const StyledWrapper = styled(Wrapper)`
  align-items: center;
  margin-top: 16px;
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
