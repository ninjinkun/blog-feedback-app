import firebase from 'firebase/app';
import 'firebase/auth';
import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { UserState, fetchUser } from '../../../redux/slices/user';
import { AppState } from '../../../redux/app-reducer';
import LoadingView from '../../molecules/LoadingView/index';
import PageLayout from '../../templates/PageLayout/index';

const AuthPage: React.FC<RouteComponentProps> = (props) => {
  const userState = useSelector<AppState, UserState>((state) => state.user);
  const dispatch = useDispatch();

  const { children, location } = props;

  useEffect(() => {
    dispatch(fetchUser(firebase.auth()));
    return () => undefined;
  }, [dispatch]);

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

export default withRouter(AuthPage);
