import { getAuth } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/hooks';
import { Navigate, Outlet, useLocation } from 'react-router';
import { AppState } from '../../../redux/app-reducer';
import { UserState, fetchUser } from '../../../redux/slices/user';
import LoadingView from '../../molecules/LoadingView/index';
import PageLayout from '../../templates/PageLayout/index';

const AuthPage: React.FC = () => {
  const userState = useSelector<AppState, UserState>((state) => state.user);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchUser(getAuth()));
    return () => undefined;
  }, [dispatch]);

  const { user, loading } = userState;
  if (user) {
    return <Outlet />;
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
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
};

export default AuthPage;
