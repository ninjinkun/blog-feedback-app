import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
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
  fetchUser: (auth: firebase.auth.Auth) => any;
};

type Props = StateProps & DispatchProps & RouteComponentProps;
class IndexPage extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchUser(firebase.auth());
  }
  render() {
    const { loading, user } = this.props.user;
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
  )(IndexPage)
);
