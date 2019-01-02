import { storiesOf } from '@storybook/react';
import React from 'react';
import { CountType } from '../../../models/consts/count-type';
import ServiceIcon from './index';

storiesOf('atoms/ServiceIcon', module)
  .add('Twitter', () => <ServiceIcon type={CountType.Twitter} />)
  .add('Facebook', () => <ServiceIcon type={CountType.Facebook} />)
  .add('HatenaBookmark', () => <ServiceIcon type={CountType.HatenaBookmark} />);
