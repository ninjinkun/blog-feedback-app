import React from 'react';
import Anchor from './index';
import { storiesOf } from '@storybook/react';

storiesOf('atoms/Anker', module).add('default', () => (
    <Anchor href="#">アンカー</Anchor>
  ));
