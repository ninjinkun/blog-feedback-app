import * as React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { BrowserRouter, Route, Link, Redirect, match as matchParam, withRouter, RouteComponentProps } from 'react-router-dom';
import { AppState } from '../../../redux/states/app-state';
import { connect } from 'react-redux';
import { UserState } from '../../../redux/states/user-state';
import { Dispatch } from 'redux';
import { fetchUser } from '../../../redux/actions/user-action';

type Props = {
    user: UserState,
    fetchUser: (auth: firebase.auth.Auth) => any,
};

class LoginView extends React.PureComponent<Props> {
    componentDidMount() {
      this.props.fetchUser(firebase.auth());
    }
    render() {
        if (this.props.user.user) {
            return (
                <Redirect from="/" to="/blogs" />
            );
        } else {
            return (
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            );
        }
    }
}

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/signedIn',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
};

const mapStateToProps = (state: AppState) => ({
    user: state.user
});

function mapDispatchToProps(dispatch: Dispatch<AppState>) {
    return {
        fetchUser: (auth: firebase.auth.Auth) => fetchUser(auth)(dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
