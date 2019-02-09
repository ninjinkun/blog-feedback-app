import { storiesOf } from '@storybook/react';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PrivacyPage from './index';

storiesOf('pages/PrivacyPage', module).add('defalut', () => (
  <Router>
    <Route component={PrivacyPage} />
  </Router>
));
