import { storiesOf } from '@storybook/react';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import TermPage from './index';

storiesOf('pages/TermPage', module).add('defalut', () => (
  <Router>
    <Route component={TermPage} />
  </Router>
));
