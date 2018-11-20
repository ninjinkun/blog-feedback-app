import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import { initializeFirebase } from './firebase';
import { appStore } from './redux/create-store';
import SmartphoneLayout from './components/templates/SmartphoneLayout/index';
import { GlobalStyle } from './components/base-style';
import ScrollToTop from './components/templates/ScrollToTop/index';

import EntriesPage from './components/pages/EntriesPage/index';
import BlogsPage from './components/pages/BlogsPage/index';
import AddBlogPage from './components/pages/AddBlogPage/index';
import AuthPage from './components/pages/AuthPage/index';
import SettingsPage from './components/pages/SettingsPage/index';
import SettingPage from './components/pages/SettingPage/index';
import IndexPage from './components/pages/IndexPage/index';

initializeFirebase();

const App = () => (
  <React.Fragment>
    <GlobalStyle />
    <Provider store={appStore}>
      <SmartphoneLayout>
        <Router>
          <ScrollToTop>
            <Route exact={true} path="/" component={IndexPage} />
            <Route exact={true} path="/signin" component={AuthPage} />
            <Route exact={true} path="/blogs" component={BlogsPage} />
            <Route exact={true} path="/add" component={AddBlogPage} />
            <Route exact={true} path="/settings" component={SettingsPage} />
            <Route exact={true} path="/settings/:blogURL" component={SettingPage} />
            <Route exact={true} path="/blogs/:blogURL" component={EntriesPage} />
          </ScrollToTop>
        </Router>
      </SmartphoneLayout>
    </Provider>
  </React.Fragment>
);
export default App;
