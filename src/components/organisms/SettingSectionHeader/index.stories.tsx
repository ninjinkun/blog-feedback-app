import { storiesOf } from '@storybook/react';
import React from 'react';
import SettingSectionHeader from './index';

storiesOf('organisms/SettingSectionHeader', module).add('default', () => (
  <SettingSectionHeader>Blog Settings</SettingSectionHeader>
));
