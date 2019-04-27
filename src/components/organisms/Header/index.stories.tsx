import { storiesOf } from '@storybook/react';
import React from 'react';
import Header from './index';

storiesOf('organisms/Header', module)
  .add('default', () => <Header title={'BlogFeedback'} />)
  .add('Long Title', () => (
    <Header title={'BlogFeedback BlogFeedback BlogFeedback BlogFeedback'} addButtonLink="/" backButtonLink="/" />
  ));
