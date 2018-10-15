import * as React from 'react';
import Anchor from './index';
import { storiesOf, Story } from '@storybook/react';

storiesOf('atoms/Anker', module).add('default', () => (
    <Anchor href="#">アンカー</Anchor>
  ));
