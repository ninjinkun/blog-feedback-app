
import React from 'react';
import styled from 'styled-components';

// inspired from ScrollView via React Native for Web 
const ScrollView = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  transform: translateZ(0px);
  flex-shrink: 0;
  flex-grow: 1;
  flex-basis: auto;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
`;

export default ScrollView;