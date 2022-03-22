import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { GlobalStyle } from './components/base-style';
import ScrollToTop from './components/templates/ScrollToTop/index';
import SmartphoneLayout from './components/templates/SmartphoneLayout/index';
import { initializeFirebase } from './firebase';
import { appStore } from './redux/create-store';

import AddBlogPage from './components/pages/AddBlogPage/index';
import AuthPage from './components/pages/AuthPage/index';
import BlogsPage from './components/pages/BlogsPage/index';
import FeedPage from './components/pages/FeedPage/index';
import IndexPage from './components/pages/IndexPage/index';
import PrivacyPage from './components/pages/PrivarcyPage/index';
import SettingPage from './components/pages/SettingPage/index';
import SettingsPage from './components/pages/SettingsPage/index';
import SignInPage from './components/pages/SignInPage/index';
import TermPage from './components/pages/TermPage/index';
import { initializeGoogleAnalytics } from './ga';
import withTracker from './withTracker';

initializeFirebase();
initializeGoogleAnalytics();

const App = () => (
  <React.Fragment>
    <GlobalStyle />
    <Provider store={appStore}>
      <SmartphoneLayout>
        <Router>
          <ScrollToTop>
            <Switch>
              <Route exact path="/" component={withTracker(IndexPage)} />
              <Route exact path="/signin" component={withTracker(SignInPage)} />
              <Route exact path="/term" component={withTracker(TermPage)} />
              <Route exact path="/privacy" component={withTracker(PrivacyPage)} />
              <AuthPage>
                <Switch>
                  <Route exact path="/add" component={withTracker(AddBlogPage)} />
                  <Route exact path="/blogs" component={withTracker(BlogsPage)} />
                  <Route path="/blogs/:blogURL" component={withTracker(FeedPage)} />
                  <Route exact path="/settings" component={withTracker(SettingsPage)} />
                  <Route path="/settings/:blogURL" component={withTracker(SettingPage)} />
                </Switch>
              </AuthPage>
            </Switch>
          </ScrollToTop>
        </Router>
      </SmartphoneLayout>
    </Provider>
  </React.Fragment>
);
export default App;
