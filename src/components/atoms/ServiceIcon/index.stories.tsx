import React from 'react';
import ServiceIcon, { FacebookIcon } from './index';
import { storiesOf } from '@storybook/react';
import { CountType } from '../../../consts/count-type';

storiesOf('atoms/ServiceIcon', module)
.add('Twitter', () => <ServiceIcon type={CountType.Twitter} />)
.add('Facebook', () => <ServiceIcon type={CountType.Facebook} />)
.add('HatenaBookmark', () => <ServiceIcon type={CountType.HatenaBookmark} />);
