import { storiesOf } from '@storybook/react';
import React from 'react';
import ScrollView from './index';

storiesOf('atoms/ScrollView', module).add('default', () => (
  <ScrollView>
    {[...Array(1000).keys()].map((i) => (
      <span key={i}>{i}</span>
    ))}
  </ScrollView>
));
