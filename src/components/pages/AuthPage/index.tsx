import firebase from 'firebase/app';
import 'firebase/auth';
import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { fetchUser, UserActions } from '../../../redux/actions/user-action';
import { AppState } from '../../../redux/states/app-state';
import { UserState } from '../../../redux/states/user-state';
import LoadingView from '../../molecules/LoadingView/index';
import PageLayout from '../../templates/PageLayout/index';

type StateProps = {
  userState: UserState;
};

type DispatchProps = {
  fetchUser: (...props: Parameters<typeof fetchUser>) => void;
};

type Props = StateProps & DispatchProps & RouteComponentProps;

const AuthPage: React.FC<Props> = (props) => {
  const { children, userState, location, fetchUser } = props;

  useEffect(() => {
    fetchUser(firebase.auth());
    return () => undefined;
  }, [fetchUser]);

  const { user, loading } = userState;
  if (user) {
    return <Fragment>{children}</Fragment>;
  } else if (loading) {
    return (
      <PageLayout
        header={{
          title: '',
        }}
      >
        <LoadingView />
      </PageLayout>
    );
  } else {
    return <Redirect to={{ pathname: '/signin', state: { from: location } }} />;
  }
};

function mapStateToProps(state: AppState): StateProps {
  return {
    userState: state.user,
  };
}

type TD = ThunkDispatch<AppState, undefined, UserActions>;
function mapDispatchToProps(dispatch: TD): DispatchProps {
  return {
    fetchUser: (auth: firebase.auth.Auth) => dispatch(fetchUser(auth)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthPage));
