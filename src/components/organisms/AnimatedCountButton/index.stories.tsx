import React from 'react';
import AnimatedCountButton from './index';
import { storiesOf, Story } from '@storybook/react';
import { CountType } from '../../../consts/count-type';

storiesOf('organisms/AnimatedCountButton', module)
.add('not animate', () => <AnimatedCountButton type={CountType.Twitter} animate={false} count={0}/>)
.add('animate', () => <AnimatedCountButton type={CountType.HatenaBookmark} animate={true} count={100}/>);
