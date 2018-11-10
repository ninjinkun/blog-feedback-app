import * as React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route, match as matchParam, RouteComponentProps } from 'react-router-dom';
import { Provider } from 'react-redux';

import EntriesPage from './components/pages/EntriesPage/index';
import BlogsPage from './components/pages/BlogsPage/index';
import AddBlogPage from './components/pages/AddBlogPage/index';
import LoginPage from './components/pages/LoginPage/index';
import Header from './components/pages/Header/index';

import { initializeFirebase } from './firebase';
import { createStore, compose, applyMiddleware } from 'redux';
import Wrapper from './components/atoms/Wrapper';
import SmartphoneLayout from './components/templates/SmartphoneLayout/index';
import { baseStyle } from './components/base-style';
import ScrollToTop from './components/templates/ScrollToTop/index';
import { appStore } from './redux/create-store';

initializeFirebase();
baseStyle();

const App = () => (
  <Provider store={appStore}>
    <SmartphoneLayout>
      <BrowserRouter>
        <BodyWrapper>
          <HeaderWrapper>
            <StyledHeader />
          </HeaderWrapper>
          <HeaderSpacer />
          <ScrollToTop>
            <Route exact={true} path="/" component={LoginPage} />
            <Route exact={true} path="/blogs" component={BlogsPage} />
            <Route exact={true} path="/add" component={AddBlogPage} />
            <Route
              exact={true}
              path="/blogs/:url"
              component={Feed}
            />
          </ScrollToTop>
        </BodyWrapper>
      </BrowserRouter>
    </SmartphoneLayout>
  </Provider>
);
export default App;

const BodyWrapper = styled(Wrapper)`
  min-height: 100vh;
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

const HeaderSpacer = styled.div`
  min-height: 64px;
  width: 100%;
`;

const Feed = ({ match }: { match: matchParam<{ url: string }> } & RouteComponentProps<{}>) => (
  <EntriesPage url={decodeURIComponent(match.params.url)} />
);
