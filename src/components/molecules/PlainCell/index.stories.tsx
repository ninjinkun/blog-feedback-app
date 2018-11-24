import { storiesOf } from '@storybook/react';
import React from 'react';
import PlainCell from './index';

storiesOf('molecules/PlainCell', module).add('default', () => (
  <PlainCell>
    <div>PlainCell</div>
  </PlainCell>
));
