import { getAuth } from 'firebase/auth';
import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/hooks';
import { Navigate } from 'react-router';
import { AppState } from '../../../redux/app-reducer';
import { UserState, fetchUser } from '../../../redux/slices/user';
import LoadingView from '../../molecules/LoadingView/index';
import PageLayout from '../../templates/PageLayout/index';
import WelcomePage from '../WelcomePage/index';

const IndexPage: React.FC = () => {
  const user = useSelector<AppState, UserState>((state) => state.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUser(getAuth()));
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
    return <Navigate to="/blogs" replace />;
  } else {
    return <WelcomePage />;
  }
};

export default IndexPage;
