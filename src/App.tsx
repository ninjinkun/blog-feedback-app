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

initializeFirebase();
const store = createStore(
  appReducer,
  composeWithDevTools(applyMiddleware()),
);

const App = () => (
  <Provider store={store}>
    <Wrapper>
      <BrowserRouter>
        <Wrapper>
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
        </Wrapper>
      </BrowserRouter>
    </Wrapper>
  </Provider>
);
export default App;

const StyledHeader = styled(Header)`
      position: fixed;
      width: 100%;
      display: flex;
      flex-direction: column;
    `;

const HeaderWrapper = styled.div`
      z-index: 100;
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
    `;

const HeaderSpacer = styled.div`
      min-height: 64px;
      width: 100%;
    `;

const Feed = ({ match }: { match: matchParam<{ url: string }> } & RouteComponentProps<{}>) => (
  <FeedView url={decodeURIComponent(match.params.url)} />
);
