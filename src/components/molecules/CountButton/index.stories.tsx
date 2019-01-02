import { storiesOf, Story } from '@storybook/react';
import React from 'react';
import { CountType } from '../../../models/consts/count-type';
import CountButton from './index';

storiesOf('molecules/CountButton', module)
  .add('Twitter', () => <CountButton type={CountType.Twitter} />)
  .add('Facebook', () => <CountButton type={CountType.Facebook} count={0} />)
  .add('HatenaBookmark', () => <CountButton type={CountType.HatenaBookmark} count={1000} />);
