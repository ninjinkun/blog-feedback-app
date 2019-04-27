import { storiesOf } from '@storybook/react';
import React from 'react';
import Button, { PrimaryButton, WarningButton } from './index';

storiesOf('atoms/Button', module)
  .add('デフォルト', () => <Button>デフォルト</Button>)
  .add('プライマリ', () => <PrimaryButton>プライマリ</PrimaryButton>)
  .add('警告', () => <WarningButton>警告</WarningButton>);
