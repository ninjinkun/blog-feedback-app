import React from 'react';
import Spinner from './index';
import { storiesOf } from '@storybook/react';

storiesOf('atoms/Spinner', module)
  .add('default', () => <Spinner />);
