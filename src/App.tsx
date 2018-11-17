import React, { createContext } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route, match as matchParam, RouteComponentProps as RCProps } from 'react-router-dom';
import { Provider } from 'react-redux';

import EntriesPage from './components/pages/EntriesPage/index';
import BlogsPage from './components/pages/BlogsPage/index';
import AddBlogPage from './components/pages/AddBlogPage/index';
import LoginPage from './components/pages/LoginPage/index';

import { initializeFirebase } from './firebase';
import { createStore, compose, applyMiddleware } from 'redux';
import Wrapper from './components/atoms/Wrapper';
import SmartphoneLayout from './components/templates/SmartphoneLayout/index';
import { baseStyle } from './components/base-style';
import ScrollToTop from './components/templates/ScrollToTop/index';
import { appStore } from './redux/create-store';
import SettingsPage from './components/pages/SettingsPage/index';
import SettingPage from './components/pages/SettingPage/index';

initializeFirebase();
baseStyle();

const App = () => (
  <Provider store={appStore}>
    <SmartphoneLayout>
      <BrowserRouter>
          <ScrollToTop>
            <Route exact={true} path="/" component={LoginPage} />
            <Route exact={true} path="/blogs" component={BlogsPage} />
            <Route exact={true} path="/add" component={AddBlogPage} />
            <Route exact={true} path="/settings" component={SettingsPage} />
            <Route exact={true} path="/setting/:blogURL" component={SettingPage} />
            <Route exact={true} path="/blogs/:blogURL" component={EntriesPage} />
          </ScrollToTop>
      </BrowserRouter>
    </SmartphoneLayout>
  </Provider>
);
export default App;

const BodyWrapper = styled(Wrapper)`
  min-height: 100vh;
`;
