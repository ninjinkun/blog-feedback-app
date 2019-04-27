import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { fetchUser, UserActions } from '../../../redux/actions/user-action';
import { AppState } from '../../../redux/states/app-state';
import { UserState } from '../../../redux/states/user-state';
import LoadingView from '../../molecules/LoadingView/index';
import PageLayout from '../../templates/PageLayout/index';
import WelcomePage from '../WelcomePage/index';

type StateProps = {
  user: UserState;
};

type DispatchProps = {
  fetchUser: (...props: Parameters<typeof fetchUser>) => void;
};

type Props = StateProps & DispatchProps & RouteComponentProps;
const IndexPage: React.FC<Props> = props => {
  useEffect(() => {
    props.fetchUser(firebase.auth());
    return () => undefined;
  }, []);

  const { loading, user } = props.user;
  if (loading) {
    return (
      <PageLayout
        header={{
          title: 'BlogFeedback',
        }}
      >
        <LoadingView />
      </PageLayout>
    );
  } else if (user) {
    return <Redirect to="/blogs" />;
  } else {
    return <WelcomePage />;
  }
};

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexPage);
