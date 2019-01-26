import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { fetchUser, UserActions } from '../../../redux/actions/user-action';
import { AppState } from '../../../redux/states/app-state';
import { UserState } from '../../../redux/states/user-state';
import LoadingView from '../../molecules/LoadingView/index';
import PageLayout from '../../templates/PageLayout/index';

type StateProps = {
  user: UserState;
};

type DispatchProps = {
  fetchUser: (...props: Parameters<typeof fetchUser>) => void;
};

type Props = StateProps & DispatchProps & RouteComponentProps;

class AuthPage extends React.PureComponent<Props> {
  componentWillMount() {
    this.props.fetchUser(firebase.auth());
  }
  render() {
    const { children } = this.props;
    const { user, loading } = this.props.user;
    if (user) {
      return children;
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
      return <Redirect to={{ pathname: '/signin', state: { from: this.props.location } }} />;
    }
  }
}

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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AuthPage)
);
