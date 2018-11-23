import React from 'react';
import SettingSectionHeader from './index';
import { storiesOf } from '@storybook/react';

storiesOf('organisms/SettingSectionHeader', module)
.add('default', () => <SettingSectionHeader>Blog Settings</SettingSectionHeader>)
