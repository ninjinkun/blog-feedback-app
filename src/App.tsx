import * as React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route, Link, Redirect, match as matchParam, withRouter, RouteComponentProps } from 'react-router-dom';
import { Provider } from 'react-redux';

import { appReducer } from './redux/reducers/app-reducer';

import FeedView from './components/pages/FeedView/index';
import BlogView from './components/pages/BlogView/index';
import AddBlogView from './components/pages/AddBlogView/index';
import LoginView from './components/pages/LoginView/index';
import Header from './components/pages/Header/index';

import { initializeFirebase } from './firebase';
import { createStore, compose, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import Wrapper from './components/atoms/Wrapper';
import SmartphoneLayout from './components/templates/SmartphoneLayout/index';
initializeFirebase();
const store = createStore(
  appReducer,
  composeWithDevTools(applyMiddleware()),
);

const App = () => (
  <Provider store={store}>
    <SmartphoneLayout>
      <BrowserRouter>
        <BodyWrapper>
          <HeaderWrapper>
            <StyledHeader />
          </HeaderWrapper>
          <HeaderSpacer />
          <Route exact={true} path="/" component={LoginView} />
          <Route exact={true} path="/blogs" component={BlogView} />
          <Route exact={true} path="/add" component={AddBlogView} />
          <Route
            exact={true}
            path="/blogs/:url"
            component={Feed}
          />
        </BodyWrapper>
      </BrowserRouter>
    </SmartphoneLayout>
  </Provider>
);
export default App;

import { injectGlobal } from 'styled-components';

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  html, body {
    height: 100vh;
    width: 100vw;
    margin: 0;
  }
  #root {
    height: 100vh;
  }
`;

const StyledHeader = styled(Header)`
  position: fixed;
  width: 100%;
  display: flex;
  flex-direction: column;
  left: 0;
  right: 0;
`;

const HeaderWrapper = styled(Wrapper)`
  z-index: 100;
  position: relative;
  width: 100%;
  align-items: center;
`;

const BodyWrapper = styled(Wrapper)`
  min-height: 100vh;
  width: 100%;
`;

const HeaderSpacer = styled.div`
  min-height: 64px;
  width: 100%;
`;

const Feed = ({ match }: { match: matchParam<{ url: string }> } & RouteComponentProps<{}>) => (
  <FeedView url={decodeURIComponent(match.params.url)} />
);
