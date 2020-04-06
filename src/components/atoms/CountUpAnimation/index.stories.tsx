import { storiesOf } from '@storybook/react';
import React from 'react';
import CountUp from './index';

storiesOf('atoms/CountUpAnimation', module).add('default', () => (
  <CountUp start={100.0} end={200.0}>
    {(count) => <div>{CountQueuingStrategy}</div>}
  </CountUp>
));
