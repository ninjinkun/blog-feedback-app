import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import styled from 'styled-components';

import { Location } from 'history';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { fetchUser, UserActions } from '../../../redux/actions/user-action';
import { AppState } from '../../../redux/states/app-state';
import { UserState } from '../../../redux/states/user-state';
import Anker from '../../atoms/Anker/index';
import Wrapper from '../../atoms/Wrapper/index';
import LoadingView from '../../molecules/LoadingView/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

type StateProps = {
  user: UserState;
};

type DispatchProps = {
  fetchUser: (...props: Parameters<typeof fetchUser>) => void;
};

type Props = StateProps & DispatchProps & RouteComponentProps<{}, {}, { from?: Location }>;

class SignInPage extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchUser(firebase.auth());
  }
  render() {
    const { loading, user } = this.props.user;
    if (user) {
      const from = (this.props.location.state && this.props.location.state.from) || 'blogs';
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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInPage);

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

function mapStateToProps(state: AppState): StateProps {
  return {
    user: state.user,
  };
}

type TD = ThunkDispatch<AppState, undefined, UserActions>;
function mapDispatchToProps(dispatch: TD): DispatchProps {
  return {
    fetchUser: (auth: firebase.auth.Auth) => dispatch(fetchUser(auth)),
  };
}
