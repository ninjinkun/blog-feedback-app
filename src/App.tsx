import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router';

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
import { initializeGoogleAnalytics, usePageTracking } from './ga';

initializeFirebase();
initializeGoogleAnalytics();

const PageTracker = () => {
  usePageTracking();
  return null;
};

const App = () => (
  <React.Fragment>
    <GlobalStyle />
    <Provider store={appStore}>
      <SmartphoneLayout>
        <BrowserRouter>
          <ScrollToTop />
          <PageTracker />
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/term" element={<TermPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route element={<AuthPage />}>
              <Route path="/add" element={<AddBlogPage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/:blogURL" element={<FeedPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/:blogURL" element={<SettingPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SmartphoneLayout>
    </Provider>
  </React.Fragment>
);
export default App;
