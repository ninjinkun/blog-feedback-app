import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { AppState } from '../../../redux/app-reducer';
import { UserState, fetchUser } from '../../../redux/slices/user';
import LoadingView from '../../molecules/LoadingView/index';
import PageLayout from '../../templates/PageLayout/index';
import WelcomePage from '../WelcomePage/index';

const IndexPage: React.FC<RouteComponentProps> = () => {
  const user = useSelector<AppState, UserState>((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser(firebase.auth()));
    return () => undefined;
  }, [dispatch]);

  const { loading, user: userData } = user;
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
  } else if (userData) {
    return <Redirect to="/blogs" />;
  } else {
    return <WelcomePage />;
  }
};

export default IndexPage;
