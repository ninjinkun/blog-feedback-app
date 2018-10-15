import * as React from 'react';
import SmartphoneLayout from './index';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

storiesOf('templates/SmartphoneLayout', module)
  .add('default', () => <SmartphoneLayout>brabrabra</SmartphoneLayout>);
