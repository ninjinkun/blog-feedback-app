import React from 'react';
import Twincle from './index';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

storiesOf('atoms/Twincle', module)
  .add('animate', () => (<Twincle animate={true}><Content /></Twincle>))
  .add('no animate', () => (<Twincle animate={false}><Content /></Twincle>));

const Content = styled.div`
  width: 200px;
  height: 30px;
  background: #373737;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 5px 15px 0px;
`;