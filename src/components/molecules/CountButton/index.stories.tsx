import React from 'react';
import CountButton from './index';
import { storiesOf, Story } from '@storybook/react';
import CountType from '../../../consts/count-type';

storiesOf('molecules/CountButton', module)
.add('Twitter', () => <CountButton type={CountType.Twitter} />)
.add('Facebook', () => <CountButton type={CountType.Facebook} count={0}/>)
.add('HatenaBookmark', () => <CountButton type={CountType.HatenaBookmark} count={1000} />);
