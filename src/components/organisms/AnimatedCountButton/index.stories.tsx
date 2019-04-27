import { storiesOf } from '@storybook/react';
import React from 'react';
import { CountType } from '../../../models/consts/count-type';
import AnimatedCountButton from './index';

storiesOf('organisms/AnimatedCountButton', module)
  .add('not animate', () => <AnimatedCountButton type={CountType.Twitter} animate={false} count={0} />)
  .add('animate', () => <AnimatedCountButton type={CountType.HatenaBookmark} animate={true} count={100} />);
