import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Header from './index';

storiesOf('organisms/Header', module)
  .add('default', () => <Header title={'BlogFeedback'} />)
  .add('Long Title', () => (
    <Header title={'BlogFeedback BlogFeedback BlogFeedback BlogFeedback'} addButtonLink="/" backButtonLink="/" />
  ));
