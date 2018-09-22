import * as React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { BrowserRouter, Route, Link, Redirect, match as matchParam, withRouter, RouteComponentProps } from 'react-router-dom';

export default class Login extends React.PureComponent<{}, { user?: firebase.User }> {
    constructor(props: any) {
      super(props);
      this.state = { user: undefined };
    }
  
    componentDidMount() {
      firebase.auth().onAuthStateChanged((user) => {
        this.setState({ 'user': user! });
      });
    }
  
    render() {
      if (this.state.user) {
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
  